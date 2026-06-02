import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Button, Badge, Alert } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";
import { generateTicketPDF } from "../utils/generateTicketPDF";
import "../styles/Dashboard.css";
import Sidebar from "../Components/Sidebar/Sidebar";

const ClientDashboard = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/booking/user/${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (data.success) setBookings(data.data || []);
        else setError("Could not load bookings.");
      } catch { setError("Network error. Please try again."); }
      finally { setLoading(false); }
    };
    fetchBookings();
  }, [user, navigate]);

  const handleDownload = async (booking) => {
    setDownloading(booking._id);
    try {
      await generateTicketPDF({
        ticketNumber: booking.ticketNumber,
        tourName:     booking.tourName,
        fullName:     booking.fullName,
        phone:        booking.phone,
        bookAt:       booking.bookAt,
        groupSize:    booking.groupSize,
        totalPaid:    booking.payment?.amountPaid || 0,
        userEmail:    booking.userEmail,
      });
    } finally { setDownloading(null); }
  };

  const statusColor = { confirmed: "success", pending: "warning", cancelled: "danger" };

  const navLinks = [
    { path: "/my-bookings", display: "My Bookings", icon: "ri-ticket-2-line" },
    { path: "/tours", display: "Explore Tours", icon: "ri-map-2-line" },
  ];

  return (
    <Sidebar navLinks={navLinks}>
      <div className="dashboard__header mb-4">
        <h2>🧳 My Bookings</h2>
        <p className="text-muted">Welcome back, <strong className="text-dark">{user?.username}</strong> — here are your SkyLiners adventures.</p>
      </div>

      {loading && <div className="loader-container"><div className="loader" /><div className="loading-text">Loading your bookings...</div></div>}
      {error && <Alert color="danger">{error}</Alert>}

      {!loading && bookings.length === 0 && (
        <div className="empty__state text-center py-5 bg-white rounded shadow-sm">
          <i className="ri-map-pin-2-line" style={{ fontSize: '3rem', color: '#f5a623' }}></i>
          <h4 className="mt-3 fw-bold">No bookings yet!</h4>
          <p className="text-muted">Start your Pakistani adventure today.</p>
          <Button className="btn primary__btn mt-3 px-4" onClick={() => navigate("/tours")}>
            Explore Tours <i className="ri-arrow-right-line ms-1"></i>
          </Button>
        </div>
      )}

      <Row>
        {bookings.map((b) => (
          <Col lg="6" xl="6" key={b._id} className="mb-4">
            <div className="booking__card h-100 d-flex flex-column bg-white rounded shadow-sm border-0 transition-all p-4" style={{ transition: 'transform 0.2s', ':hover': {transform: 'translateY(-5px)'} }}>
              <div className="booking__card-header d-flex justify-content-between align-items-center mb-3">
                <span className="ticket__no fw-bold text-secondary">🎫 {b.ticketNumber || "—"}</span>
                <Badge color={statusColor[b.status] || "secondary"} className="text-capitalize px-3 py-2 rounded-pill">
                  {b.status}
                </Badge>
              </div>
              <div className="booking__card-body flex-grow-1">
                <h4 className="fw-bold mb-3" style={{ color: 'var(--heading-color)' }}>{b.tourName}</h4>
                <div className="booking__meta text-muted small d-flex flex-column gap-2 mb-4">
                  <span><i className="ri-user-line text-info fs-5 me-2 align-middle"></i> <strong className="text-dark">{b.fullName}</strong></span>
                  <span><i className="ri-calendar-line text-info fs-5 me-2 align-middle"></i> <strong className="text-dark">{new Date(b.bookAt).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}</strong></span>
                  <span><i className="ri-group-line text-info fs-5 me-2 align-middle"></i> <strong className="text-dark">{b.groupSize} Person(s)</strong></span>
                  <span><i className="ri-secure-payment-line text-success fs-5 me-2 align-middle"></i> <strong className="text-success fs-6">PKR {Number(b.payment?.amountPaid || 0).toLocaleString("en-PK")}</strong></span>
                </div>
              </div>
              <div className="booking__card-footer d-flex gap-3 mt-auto pt-3 border-top">
                <Button
                  className="btn primary__btn flex-grow-1"
                  onClick={() => handleDownload(b)}
                  disabled={downloading === b._id}
                >
                  <i className="ri-download-2-line me-1"></i>
                  {downloading === b._id ? "Processing..." : "Get PDF"}
                </Button>
                <Button
                  className="btn btn-outline-dark flex-grow-1"
                  style={{ borderRadius: '50px' }}
                  onClick={() => navigate(`/survey/${b._id}`)}
                >
                  <i className="ri-star-line me-1"></i> Rate Tour
                </Button>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Sidebar>
  );
};

export default ClientDashboard;
