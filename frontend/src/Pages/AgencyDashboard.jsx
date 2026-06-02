import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Badge, Alert, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";
import "../styles/Dashboard.css";

const AgencyDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [logs, setLogs] = useState([]);
  const [offerings, setOfferings] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("bookings");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (user.role !== "agency" && user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const [bRes, lRes, oRes, tRes] = await Promise.all([
          fetch(`${BASE_URL}/booking`, { headers: { Authorization: `Bearer ${user.token}` } }),
          fetch(`${BASE_URL}/logs?role=user`, { headers: { Authorization: `Bearer ${user.token}` } }),
          fetch(`${BASE_URL}/offerings/agency`, { headers: { Authorization: `Bearer ${user.token}` } }),
          fetch(`${BASE_URL}/tours`)
        ]);
        const bData = await bRes.json();
        const lData = await lRes.json();
        const oData = await oRes.json();
        const tData = await tRes.json();
        
        if (bData.success) setBookings(bData.data || []);
        if (lData.success) setLogs(lData.data || []);
        if (oData.success) setOfferings(oData.data || []);
        if (tData.success) setTours(tData.data || []);
      } catch { setError("Failed to load dashboard data."); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [user, navigate]);

  const statusColor = { confirmed: "success", pending: "warning", cancelled: "danger" };
  const actionColor = { login: "success", logout: "danger", booking: "primary" };

  return (
    <section className="dashboard__section">
      <Container>
        <div className="dashboard__header">
          <h2>🏢 Agency Dashboard</h2>
          <p>Logged in as <strong>{user?.username}</strong> (Agency) — manage your bookings and client activity.</p>
        </div>

        {error && <Alert color="danger">{error}</Alert>}

        {/* Tab bar */}
        <div className="dashboard__tabs mb-4">
          <button className={`tab__btn ${tab === "bookings" ? "active" : ""}`} onClick={() => setTab("bookings")}>
            <i className="ri-list-check me-1"></i> All Bookings
          </button>
          <button className={`tab__btn ${tab === "offerings" ? "active" : ""}`} onClick={() => setTab("offerings")}>
            <i className="ri-map-pin-line me-1"></i> My Offerings
          </button>
          <button className={`tab__btn ${tab === "logs" ? "active" : ""}`} onClick={() => setTab("logs")}>
            <i className="ri-history-line me-1"></i> Client Activity Logs
          </button>
        </div>

        {loading && <div className="loader-container"><div className="loader" /><div className="loading-text">Loading...</div></div>}

        {/* Bookings Tab */}
        {!loading && tab === "bookings" && (
          <div className="agency__bookings">
            <h5 className="mb-3">All Bookings ({bookings.length})</h5>
            <div className="table-responsive">
              <table className="table table-hover agency__table">
                <thead>
                  <tr>
                    <th>Ticket #</th>
                    <th>Tour</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Group</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr><td colSpan={6} className="text-center text-muted py-4">No bookings found</td></tr>
                  ) : bookings.map((b) => (
                    <tr key={b._id}>
                      <td><code>{b.ticketNumber || "—"}</code></td>
                      <td>{b.tourName}</td>
                      <td>{b.fullName}<br/><small className="text-muted">{b.userEmail}</small></td>
                      <td>{new Date(b.bookAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td>{b.groupSize}</td>
                      <td><Badge color={statusColor[b.status] || "secondary"} className="text-capitalize">{b.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Activity Logs Tab */}
        {!loading && tab === "logs" && (
          <div className="agency__logs">
            <h5 className="mb-3">Client Activity Logs ({logs.length})</h5>
            <div className="table-responsive">
              <table className="table table-hover agency__table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Action</th>
                    <th>Time</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr><td colSpan={4} className="text-center text-muted py-4">No activity logs</td></tr>
                  ) : logs.map((log) => (
                    <tr key={log._id}>
                      <td>{log.username}</td>
                      <td><Badge color={actionColor[log.action] || "secondary"} className="text-capitalize">{log.action}</Badge></td>
                      <td>{new Date(log.createdAt).toLocaleString("en-PK")}</td>
                      <td><small className="text-muted">{log.ipAddress}</small></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Offerings Tab */}
        {!loading && tab === "offerings" && (
          <div className="agency__offerings">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>My Offerings ({offerings.length})</h5>
              <Button color="primary" size="sm" onClick={() => navigate("/add-offering")}>+ Add New Offering</Button>
            </div>
            
            <div className="table-responsive">
              <table className="table table-hover agency__table">
                <thead>
                  <tr>
                    <th>Global Route</th>
                    <th>Comfort</th>
                    <th>Price</th>
                    <th>Seats Limit</th>
                    <th>Boarding</th>
                    <th>Departure</th>
                  </tr>
                </thead>
                <tbody>
                  {offerings.length === 0 ? (
                    <tr><td colSpan={6} className="text-center text-muted py-4">No tour offerings created yet.</td></tr>
                  ) : offerings.map((o) => (
                    <tr key={o._id}>
                      <td>{o.masterTour?.title || o.masterTour}</td>
                      <td><Badge color="info">{o.comfortLevel}</Badge></td>
                      <td>${o.price}</td>
                      <td>{o.seatLimit}</td>
                      <td>{o.boardingPlace}</td>
                      <td>{o.departureTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};

export default AgencyDashboard;
