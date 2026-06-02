import React, { useState, useRef, useEffect, useContext } from "react";
import { Container, Row, Col, Form, ListGroup, Alert } from "reactstrap";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import calculateAvgRating from "../utils/avgRating";
import avtar from "../assets/images/avatar.jpg";
import Booking from "../Components/Booking/Booking";
import "../styles/Tourdetails.css";
import axios from "axios";
import { BASE_URL, STRIPE_PK } from "../utils/config";
import { AuthContext } from "../context/AuthContext";
import FAQ from "../Shared/FAQ";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(STRIPE_PK);

const TourDetails = () => {
  const { id } = useParams();
  const reviewMsgRef = useRef("");
  const [tourRating, setTourRating] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { user } = useContext(AuthContext);
  const [isReviewSuccess, setIsReviewSuccess] = useState(false);
  const [isReviewError, setIsReviewError] = useState(false);
  const [isLoginAlertVisible, setIsLoginAlertVisible] = useState(false);

  const [offerings, setOfferings] = useState([]);
  const [selectedOffering, setSelectedOffering] = useState(null);
  const [sortParam, setSortParam] = useState("price-asc");

  const { data: tour, loading: loadingTour, error: errorTour } = useFetch(`tours/${id}`);
  const { data: fetchedReviews, loading: loadingReviews, error: errorReviews } = useFetch(`review/${id}/`);
  const { data: fetchedOfferings, loading: loadingOfferings } = useFetch(`offerings/route/${id}`);

  useEffect(() => {
    if (fetchedReviews) setReviews(fetchedReviews);
  }, [fetchedReviews]);

  useEffect(() => {
    if (fetchedOfferings && Array.isArray(fetchedOfferings)) {
      setOfferings(fetchedOfferings);
    }
  }, [fetchedOfferings]);

  if (loadingTour || loadingReviews || loadingOfferings) {
    return (
      <div className="loader-container">
        <div className="loader" />
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  if (errorTour || !tour) {
    return <div className="error__msg">Error loading tour details. Check your network</div>;
  }

  const { photo, title, desc, city, address } = tour;
  const { totalRating, avgRating } = calculateAvgRating(reviews);
  const options = { day: "numeric", month: "long", year: "numeric" };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSortParam(val);
    let sorted = [...offerings];
    if (val === "price-asc") sorted.sort((a,b) => a.price - b.price);
    if (val === "price-desc") sorted.sort((a,b) => b.price - a.price);
    if (val === "rating") sorted.sort((a,b) => b.ratings - a.ratings);
    if (val === "comfort") {
      const match = { "Luxury": 3, "Standard": 2, "Economy": 1 };
      sorted.sort((a,b) => match[b.comfortLevel] - match[a.comfortLevel]);
    }
    setOfferings(sorted);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!user) { setIsLoginAlertVisible(true); return; }
    try {
      const response = await axios.post(`${BASE_URL}/review/${id}`, {
        rating: tourRating, reviewText: reviewMsgRef.current.value, username: user.username
      });
      setReviews([...reviews, response.data]);
      setTourRating(null);
      reviewMsgRef.current.value = "";
      setIsReviewSuccess(true);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) { setIsReviewError(true); }
  };

  return (
    <>
      <section>
        <Container>
          <Row>
            <Col lg="8">
              <div className="tour__content">
                <img src={photo} alt="" />

                <div className="tour__info">
                  <h2>{title}</h2>

                  <div className="d-flex align-items-center gap-5">
                    <span className="tour__rating d-flex align-items-center gap-1">
                      <i className="ri-star-fill"></i>
                      {avgRating === 0 ? null : avgRating}
                      {totalRating === 0 ? <span>Not Rated</span> : <span>({reviews.length || 0})</span>}
                    </span>
                    <span><i className="ri-map-pin-user-fill"></i>{address}</span>
                  </div>
                  <div className="tour__extra-details">
                    <span><i className="ri-map-pin-2-line"></i>{city}</span>
                    <span>
                      {tour.price > 0 ? `Starting from ${tour.price} pkr` : "Price depends on agency"}
                    </span>
                  </div>
                  <h5>Description</h5>
                  <p>{desc}</p>
                </div>

                <div className="marketplace__section mt-5">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4>Agency Offerings ({offerings.length})</h4>
                    <select className="form-select w-25" value={sortParam} onChange={handleSortChange}>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating">Top Rated</option>
                      <option value="comfort">Comfort Level</option>
                    </select>
                  </div>

                  {offerings.length === 0 ? (
                     <Alert color="info">No agencies are currently offering this route.</Alert>
                  ) : (
                    <div className="d-grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                      {offerings.map(offering => (
                        <div key={offering._id} 
                             className={`card h-100 shadow-sm ${selectedOffering?._id === offering._id ? 'border-primary border-2 bg-light' : 'border-light'}`}
                             style={{cursor: 'pointer', transition: 'transform 0.2s', transform: selectedOffering?._id === offering._id ? 'scale(1.02)' : 'none'}}
                             onClick={() => setSelectedOffering(offering)}>
                           <div className="card-body d-flex flex-column">
                             <h5 className="card-title text-primary d-flex align-items-center justify-content-between mb-3">
                               <span className="fw-bold"><i className="ri-building-4-line me-2"></i>{offering.agency?.username}</span>
                               <span className="badge bg-warning text-dark"><i className="ri-star-s-fill"></i> {offering.ratings || 0}</span>
                             </h5>
                             
                             <div className="card-text text-muted small mt-2 flex-grow-1">
                               <div className="d-flex align-items-center mb-2"><i className="ri-time-line text-info fs-5 me-2"></i> Departs: <strong className="ms-1 text-dark">{offering.departureTime}</strong></div>
                               <div className="d-flex align-items-center mb-2"><i className="ri-map-pin-2-line text-info fs-5 me-2"></i> Boarding: <strong className="ms-1 text-dark">{offering.boardingPlace}</strong></div>
                               <div className="d-flex align-items-center mb-3"><i className="ri-vip-diamond-line text-info fs-5 me-2"></i> Comfort: <strong className="ms-1 text-dark">{offering.comfortLevel}</strong></div>
                               
                               <span className="badge bg-secondary mb-3"><i className="ri-group-line me-1"></i> {offering.seatLimit} Max Seats</span>
                             </div>
                             
                             <div className="mt-auto border-top pt-3 d-flex justify-content-between align-items-center">
                               <h4 className="mb-0 text-success fw-bold">{offering.price} pkr</h4>
                               <button className={`btn btn-sm ${selectedOffering?._id === offering._id ? 'btn-primary' : 'btn-outline-primary'}`}>
                                 {selectedOffering?._id === offering._id ? 'Selected' : 'Select'}
                               </button>
                             </div>
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="tour__reviews mt-4">
                  <h4>Reviews ({reviews?.length || 0} reviews)</h4>
                  {isReviewSuccess && <Alert color="success" toggle={() => setIsReviewSuccess(false)}>Review Successful</Alert>}
                  {isReviewError && <Alert color="danger" toggle={() => setIsReviewError(false)}>Failed to submit review. Please try again.</Alert>}
                  {isLoginAlertVisible && <Alert color="warning" toggle={() => setIsLoginAlertVisible(false)}>Please login to submit a review.</Alert>}
                  
                  <Form onSubmit={submitHandler}>
                    <div className="d-flex align-items-center gap-3 mb-4 rating__group">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <span key={value} onClick={() => setTourRating(value === tourRating ? null : value)} className={tourRating && value <= tourRating ? "active" : ""}>
                          {value} <i className="ri-star-fill"></i>
                        </span>
                      ))}
                    </div>
                    <div className="review__input">
                      <input type="text" ref={reviewMsgRef} placeholder="Share your Thoughts" required />
                      <button className="primary__btn text-white" type="submit">Submit</button>
                    </div>
                  </Form>
                  <ListGroup className="user__reviews mt-4">
                    {reviews?.map((review, index) => (
                      <div className="review__item" key={index}>
                        <img src={avtar} alt="" />
                        <div className="w-100">
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              <h5>{review.username}</h5>
                              <p>{new Date(review.createdAt).toLocaleDateString("en-in", options)}</p>
                            </div>
                            <span className="d-flex align-items-center">{review.rating} <i className="ri-star-s-fill"></i></span>
                          </div>
                          <h6>{review.reviewText}</h6>
                        </div>
                      </div>
                    ))}
                  </ListGroup>
                </div>
              </div>
            </Col>
            
            <Col lg="4">
              {offerings.length === 0 ? (
                <Alert color="secondary" className="mt-4">Check back later when agencies offer this route.</Alert>
              ) : selectedOffering ? (
                <Elements stripe={stripePromise}>
                  <Booking 
                    tour={{
                      _id: tour._id, 
                      title: `${tour.title} (by ${selectedOffering.agency?.username || 'Agency'})`,
                      price: selectedOffering.price 
                    }} 
                    offeringId={selectedOffering._id}
                    avgRating={selectedOffering.ratings || 0} 
                    reviews={[]} 
                  />
                </Elements>
              ) : (
                <Alert color="primary" className="mt-4">Please select an agency offering from the list.</Alert>
              )}
            </Col>
          </Row>
        </Container>
      </section>
      <FAQ />
    </>
  );
};

export default TourDetails;
