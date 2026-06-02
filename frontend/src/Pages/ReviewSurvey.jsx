import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils/config';
import axios from 'axios';

const ReviewSurvey = () => {
  const { bookingId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 2-way states
  const [tourRating, setTourRating] = useState(0);
  const [tourReview, setTourReview] = useState('');
  
  const [agencyRating, setAgencyRating] = useState(0);
  const [agencyReview, setAgencyReview] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetchBooking = async () => {
      try {
        const res = await fetch(`${BASE_URL}/booking/${bookingId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (data.success) {
          setBooking(data.data);
        } else { setError('Booking not found'); }
      } catch { setError('Failed to fetch booking details'); }
      finally { setLoading(false); }
    };
    fetchBooking();
  }, [bookingId, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (tourRating === 0 || agencyRating === 0) {
      setError('Please provide a rating for both the destination and the agency.');
      return;
    }

    try {
      // 1. Submit Destination (Tour) Review
      await axios.post(`${BASE_URL}/review/tour/${booking?.tourId}`, {
         reviewType: 'tour',
         rating: tourRating,
         reviewText: tourReview,
         username: user.username
      }, { headers: { Authorization: `Bearer ${user.token}` } });

      // 2. Submit Agency Offering Review
      if (booking?.offeringId) {
         await axios.post(`${BASE_URL}/review/agency/${booking?.offeringId}`, {
           reviewType: 'agency',
           rating: agencyRating,
           reviewText: agencyReview,
           username: user.username
         }, { headers: { Authorization: `Bearer ${user.token}` } });
      }

      setSuccess(true);
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (err) {
      setError('Failed to submit reviews. Please try again.');
    }
  };

  if (loading) return <div className="text-center mt-5">Loading Survey...</div>;
  if (!booking) return <Container className="mt-5"><Alert color="danger">{error}</Alert></Container>;

  return (
    <section>
      <Container>
        <Row className="justify-content-center">
          <Col lg="8">
             <div className="text-center mb-5">
               <h2 className="mb-3">How was your trip to {booking.tourName}?</h2>
               <p className="text-muted">Your feedback helps fellow travelers and improves agency standards!</p>
             </div>

             {error && <Alert color="danger">{error}</Alert>}
             {success && <Alert color="success">Thank you! Your reviews have been successfully submitted.</Alert>}

             <Form onSubmit={handleSubmit}>
               {/* Part 1: Destination */}
               <div className="p-4 shadow-sm border rounded mb-4 bg-white">
                 <h4 className="mb-3"><i className="ri-map-pin-2-line text-primary me-2"></i> Rate the Destination: {booking.tourName}</h4>
                 <p className="text-muted">How beautiful was the location and sightseeing?</p>
                 
                 <div className="d-flex align-items-center gap-3 mb-3" style={{fontSize: '1.5rem', cursor:'pointer', color: '#f5a623'}}>
                    {[1, 2, 3, 4, 5].map((val) => (
                      <i key={val} 
                         className={val <= tourRating ? "ri-star-fill" : "ri-star-line"} 
                         onClick={() => setTourRating(val)}></i>
                    ))}
                 </div>
                 
                 <textarea 
                   className="form-control" rows="3" 
                   placeholder="Share your thoughts about the destination..."
                   value={tourReview} onChange={(e) => setTourReview(e.target.value)}
                   required
                 />
               </div>

               {/* Part 2: Agency */}
               <div className="p-4 shadow-sm border rounded mb-4 bg-white">
                 <h4 className="mb-3"><i className="ri-bus-line text-info me-2"></i> Rate the Agency Service</h4>
                 <p className="text-muted">How was the comfort, timing, and staff behavior?</p>
                 
                 <div className="d-flex align-items-center gap-3 mb-3" style={{fontSize: '1.5rem', cursor:'pointer', color: '#f5a623'}}>
                    {[1, 2, 3, 4, 5].map((val) => (
                      <i key={val} 
                         className={val <= agencyRating ? "ri-star-fill" : "ri-star-line"} 
                         onClick={() => setAgencyRating(val)}></i>
                    ))}
                 </div>
                 
                 <textarea 
                   className="form-control" rows="3" 
                   placeholder="Share your thoughts about the travel agency..."
                   value={agencyReview} onChange={(e) => setAgencyReview(e.target.value)}
                   required
                 />
               </div>

               <Button color="primary" block size="lg" type="submit" disabled={success}>
                 Submit Survey
               </Button>
             </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ReviewSurvey;
