import express from 'express';
import { createBooking, getAllBookings, createPendingBooking, finalizeBookingPayment, getBooking } from '../controllers/bookingController.js';
import { verifyAdmin } from '../utils/verifyToken.js';
import Booking from '../models/Booking.js';

const bookingRoute = express.Router();

bookingRoute.post('/', createBooking);
bookingRoute.post("/pending", createPendingBooking);
bookingRoute.post("/finalize", finalizeBookingPayment);

// Get bookings for a specific user (client dashboard)
bookingRoute.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate("payment")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

bookingRoute.get('/:id', getBooking);
bookingRoute.get('/', verifyAdmin, getAllBookings);
bookingRoute.post('/getBookings', verifyAdmin, getAllBookings);

export default bookingRoute;
