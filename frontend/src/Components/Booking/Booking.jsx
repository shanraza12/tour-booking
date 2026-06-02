import React, { useState, useContext } from "react";
import "./Booking.css";
import { Form, FormGroup, ListGroup, Button, ListGroupItem, Alert } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { BASE_URL } from "../../utils/config";

const Booking = ({ tour, offeringId, avgRating, reviews }) => {
  const { price, title, _id: tourId } = tour;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const notify = useNotification();

  const [booking, setBooking] = useState({
    tourName: title,
    fullName: "",
    phone: "",
    bookAt: "",
    groupSize: "1",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isBookingSuccessful, setIsBookingSuccessful] = useState(false);
  const [isBookingFailed, setIsBookingFailed] = useState(false);
  const [isLoginAlertVisible, setIsLoginAlertVisible] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  const handleChange = (e) => {
    setBooking((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.id]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!booking.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!booking.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10,15}$/.test(booking.phone)) newErrors.phone = "Invalid phone number";
    if (!booking.bookAt) newErrors.bookAt = "Booking date is required";
    else if (new Date(booking.bookAt) < new Date().setHours(0, 0, 0, 0)) newErrors.bookAt = "Date must be in the future";
    if (!booking.groupSize || parseInt(booking.groupSize) < 1) newErrors.groupSize = "Group size must be at least 1";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setPaymentError(null);
    setIsBookingSuccessful(false);
    setIsBookingFailed(false);
    setIsLoginAlertVisible(false);
    setIsLoading(true);

    if (!user) {
      setIsLoginAlertVisible(true);
      setIsLoading(false);
      return;
    }

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    if (!stripe || !elements) {
      setPaymentError("Stripe not loaded");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Create pending booking
      const pendingRes = await fetch(`${BASE_URL}/booking/pending`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          ...booking,
          userId: user._id || user.username,
          userEmail: user.email,
          tourId,
          offeringId,
          groupSize: parseInt(booking.groupSize),
        }),
      });

      if (!pendingRes.ok) throw new Error("Failed to create booking");

      const { bookingId } = await pendingRes.json();

      // 2. Calculate amount
      const groupSize = parseInt(booking.groupSize);
      const totalAmount = price * groupSize * 1.05; // 5% tax

      // 3. Create PaymentIntent
      const intentRes = await fetch(`${BASE_URL}/create-payment-intent`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          amount: Math.round(totalAmount * 100),
          currency: "usd",
          metadata: { bookingId, tourId },
        }),
      });

      if (!intentRes.ok) throw new Error("Payment setup failed");

      const { clientSecret } = await intentRes.json();

      // 4. Confirm payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: booking.fullName,
            email: user.email,
            phone: booking.phone,
          },
        },
      });

      if (confirmError) throw confirmError;

      if (paymentIntent.status === "succeeded") {
        // 5. Finalize on backend
        const finalizeRes = await fetch(`${BASE_URL}/booking/finalize`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ bookingId, paymentIntent }),
        });

        if (!finalizeRes.ok) {
          const err = await finalizeRes.json();
          throw new Error("Payment succeeded but booking failed to confirm: " + (err.message || "Contact support"));
        }

        const finalizedData = await finalizeRes.json();

        // Store for ThankYou page PDF generation
        localStorage.setItem('lastBooking', JSON.stringify({
          ticketNumber: finalizedData?.data?.ticketNumber,
          tourName: booking.tourName,
          fullName: booking.fullName,
          phone: booking.phone,
          bookAt: booking.bookAt,
          groupSize: parseInt(booking.groupSize),
          totalPaid: total,
          userEmail: user.email,
        }));

        setIsBookingSuccessful(true);
        notify("Payment successful! Your tour is confirmed.", "success");
        setTimeout(() => navigate("/thank-you"), 500);
      }
    } catch (error) {
      setPaymentError(error.message || "Payment failed");
      notify(error.message || "Payment failed", "error");
      setIsBookingFailed(true);
    } finally {
      setIsLoading(false);
    }
  };

  const currentDate = new Date().toISOString().split("T")[0];
  const groupSize = parseInt(booking.groupSize) || 1;
  const subtotal = (price * groupSize).toFixed(2);
  const taxes = (price * groupSize * 0.05).toFixed(2);
  const total = (price * groupSize * 1.05).toFixed(2);

  return (
    <div className="booking">
      {isBookingSuccessful && <Alert color="success">Booking Confirmed!</Alert>}
      {isBookingFailed && <Alert color="danger">{paymentError}</Alert>}
      {isLoginAlertVisible && <Alert color="warning">Please login to book.</Alert>}
      <div className="booking__top d-flex align-items-center justify-content-between">
        <h3>{price}pkr <span>/Per Person</span></h3>
        <span className="tour__rating d-flex align-items-center gap-1">
          <i className="ri-star-fill"></i>
          {avgRating === 0 ? null : avgRating}
          <span>({reviews?.length || 0})</span>
        </span>
      </div>

      <div className="booking__form">
        <h5>Information</h5>
        <Form className="booking__info-form" onSubmit={handleClick}>
          <FormGroup>
            <input type="text" placeholder="Full Name" id="fullName" onChange={handleChange} value={booking.fullName} />
            {errors.fullName && <small className="text-danger">{errors.fullName}</small>}
          </FormGroup>
          <FormGroup>
            <input type="tel" placeholder="Phone" id="phone" onChange={handleChange} value={booking.phone} />
            {errors.phone && <small className="text-danger">{errors.phone}</small>}
          </FormGroup>
          <FormGroup className="d-flex align-items-center gap-3">
            <div className="w-50">
              <input type="date" id="bookAt" onChange={handleChange} value={booking.bookAt} min={currentDate} />
              {errors.bookAt && <small className="text-danger d-block">{errors.bookAt}</small>}
            </div>
            <div className="w-50">
              <input type="number" placeholder="Group Size" id="groupSize" onChange={handleChange} value={booking.groupSize} min="1" />
              {errors.groupSize && <small className="text-danger d-block">{errors.groupSize}</small>}
            </div>
          </FormGroup>

          <div className="mt-4">
            <h5>Payment Information</h5>
            <div className="p-3 border rounded bg-light">
              <CardElement options={{ style: { base: { fontSize: "16px", color: "#424770" } } }} />
            </div>
          </div>
        </Form>
      </div>

      <div className="booking__bottom">
        <ListGroup>
          <ListGroupItem className="border-0 px-0">
            <h5>{price} pkr x {groupSize} Person</h5>
            <span>{subtotal} pkr </span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0">
            <h5>Taxes (5%)</h5>
            <span>{taxes} pkr</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0 total">
            <h5>Total</h5>
            <span>{total} pkr</span>
          </ListGroupItem>
        </ListGroup>

        <Button
          className="btn primary__btn w-100 mt-4"
          onClick={handleClick}
          disabled={isLoading || !stripe}
        >
          {isLoading ? "Processing..." : "Book Now"}
        </Button>
      </div>
    </div>
  );
};

export default Booking;