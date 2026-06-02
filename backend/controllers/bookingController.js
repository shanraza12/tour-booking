import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
// Create a new booking
export const createBooking = async (req, res) => {
  const newBooking = new Booking(req.body);

  try {
    const savedBooking = await newBooking.save();
    res.status(200).json({ 
        success: true, 
        message: "Your Tour is Booked", 
        data: savedBooking
    });
  } catch (error) {
    console.error("Error while creating booking:", error);
    res.status(500).json({ 
        success: false, 
        message: "Internal Server Error",
        error: error.message // Send the error message to the client for debugging
    });
  }
};


export const createPendingBooking = async (req, res) => {
  try {
    const newBooking = new Booking({
      ...req.body,
      userId: req.user.id, // assuming you have auth middleware setting req.user
      status: "pending",
    });

    const savedBooking = await newBooking.save();

    res.status(200).json({
      success: true,
      message: "Pending booking created",
      bookingId: savedBooking._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const finalizeBookingPayment = async (req, res) => {
  const { bookingId, paymentIntent } = req.body;

  try {
    // Create Payment record
    const newPayment = new Payment({
      userId: req.user.id,
      bookingId,
      amountPaid: paymentIntent.amount / 100,
      status: "Succeeded",
      paymentIntentId: paymentIntent.id,
    });

    const savedPayment = await newPayment.save();

    // Update Booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        payment: savedPayment._id,
        status: "confirmed",
      },
      { new: true }
    ).populate("payment");

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      message: "Booking confirmed and payment recorded",
      data: updatedBooking,
    });
  } catch (error) {
    console.error("Finalize error:", error);
    res.status(500).json({ success: false, message: "Failed to finalize", error: error.message });
  }
};


// Get a single booking by ID
export const getBooking = async (req, res) => {
  const bookingId = req.params.id;

  try {
    const booking = await Booking.findById(bookingId).lean();
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Booking retrieved successfully",
      data: booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to get booking" });
  }
};

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("payment").lean();
    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to get bookings" });
  }
};

export default {
  createBooking,
  getBooking,
  getAllBookings,
};
