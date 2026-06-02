import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { generateTicketPDF } from '../utils/generateTicketPDF';
import "../styles/ThankYou.css";

const ThankYou = () => {
  const [booking, setBooking] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Load booking stored after successful payment
    const saved = localStorage.getItem('lastBooking');
    if (saved) {
      try { setBooking(JSON.parse(saved)); } catch (_) {}
    }
  }, []);

  const handleDownload = async () => {
    if (!booking) return;
    setDownloading(true);
    try {
      await generateTicketPDF(booking);
    } catch (e) {
      console.error('PDF generation failed', e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className='pt-5 text-center'>
            <div className="thank__you">
              <span>
                <i className="ri-checkbox-circle-line"></i>
              </span>
              <h1 className='mb-3 fw-semibold'>Thank You For Choosing SkyLiners!</h1>
              <h3 className='mb-2'>Your Tour is Confirmed.</h3>
              {booking?.ticketNumber && (
                <p className='mb-4' style={{ color: '#1a2b6d', fontWeight: 600, fontSize: '1.1rem' }}>
                  🎫 Ticket Reference: <strong>{booking.ticketNumber}</strong>
                </p>
              )}

              <div className='d-flex justify-content-center gap-3 flex-wrap'>
                {booking && (
                  <Button
                    className='btn primary__btn'
                    onClick={handleDownload}
                    disabled={downloading}
                    style={{ minWidth: '200px' }}
                  >
                    <i className="ri-download-2-line me-2"></i>
                    {downloading ? 'Generating PDF...' : 'Download Ticket (PDF)'}
                  </Button>
                )}
                <Button className='btn secondary__btn' style={{ minWidth: '160px' }}>
                  <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Back to Home</Link>
                </Button>
                <Button className='btn' style={{ minWidth: '160px', background: '#f5a623', border: 'none', color: '#1a2b6d', fontWeight: 700 }}>
                  <Link to="/my-bookings" style={{ color: 'inherit', textDecoration: 'none' }}>View My Bookings</Link>
                </Button>
              </div>

              {!booking && (
                <p className='mt-4 text-muted' style={{ fontSize: '0.9rem' }}>
                  Ticket download will be available here after booking. Check "My Bookings" for your history.
                </p>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ThankYou;