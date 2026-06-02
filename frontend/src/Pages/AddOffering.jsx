import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, FormGroup, Button, Label, Input, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils/config';

const AddOffering = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    masterTour: '',
    price: '',
    seatLimit: '',
    boardingPlace: '',
    departureTime: '',
    comfortLevel: 'Standard'
  });

  useEffect(() => {
    if (!user || (user.role !== "agency" && user.role !== "admin")) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch(`${BASE_URL}/tours`);
        const result = await res.json();
        if (result.success) {
          setTours(result.data);
          if (result.data.length > 0) {
            setFormData(prev => ({ ...prev, masterTour: result.data[0]._id }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch tours");
      }
    };
    fetchTours();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${BASE_URL}/offerings/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      
      setSuccess(true);
      setTimeout(() => navigate('/agency-dashboard'), 1500);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create offering');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <Container>
        <Row className="justify-content-center">
          <Col lg="8">
            <h2 className="mb-4">Create Agency Tour Offering</h2>
            <p className="text-muted mb-5">Attach your pricing, vehicle seating, and scheduling to a global Destination Route.</p>
            
            {errorMsg && <Alert color="danger">{errorMsg}</Alert>}
            {success && <Alert color="success">Offering created successfully! Redirecting...</Alert>}

            <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
              <FormGroup>
                <Label for="masterTour">Select Destination / Base Route</Label>
                <Input type="select" id="masterTour" value={formData.masterTour} onChange={handleChange} required>
                  <option value="" disabled>Select a destination</option>
                  {tours.map(t => (
                    <option key={t._id} value={t._id}>{t.title} - {t.city}</option>
                  ))}
                </Input>
              </FormGroup>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="price">Price ($)</Label>
                    <Input type="number" id="price" placeholder="e.g. 50" min="1" value={formData.price} onChange={handleChange} required />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="seatLimit">Total Seats Limit</Label>
                    <Input type="number" id="seatLimit" placeholder="e.g. 40" min="1" value={formData.seatLimit} onChange={handleChange} required />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="departureTime">Departure Time</Label>
                    <Input type="text" id="departureTime" placeholder="e.g. 08:30 AM" value={formData.departureTime} onChange={handleChange} required />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="boardingPlace">Boarding Location</Label>
                    <Input type="text" id="boardingPlace" placeholder="Terminal or Station name" value={formData.boardingPlace} onChange={handleChange} required />
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup>
                <Label for="comfortLevel">Comfort Tier</Label>
                <Input type="select" id="comfortLevel" value={formData.comfortLevel} onChange={handleChange} required>
                  <option value="Economy">Economy</option>
                  <option value="Standard">Standard</option>
                  <option value="Luxury">Luxury</option>
                </Input>
              </FormGroup>

              <Button disabled={loading} color="primary" block className="mt-4" type="submit">
                {loading ? 'Creating...' : 'Publish Offering'}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AddOffering;
