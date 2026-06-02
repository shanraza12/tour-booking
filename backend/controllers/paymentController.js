// controllers/paymentController.js
import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js"; // For potential population or joins

// GET all payments - Admin only (add your auth + admin middleware)
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({})
      .populate("bookingId", "tourName fullName bookAt groupSize status") // Optional: enrich with booking info
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error("Error fetching all payments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
};

// GET payment by ID
export const getPaymentById = async (req, res) => {
  const { id } = req.params;

  try {
    const payment = await Payment.findById(id)
      .populate("bookingId");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Dashboard Metrics - Basic but useful (Admin only)
export const getPaymentMetrics = async (req, res) => {
  try {
    const totalRevenue = await Payment.aggregate([
      { $match: { status: "Succeeded" } },
      { $group: { _id: null, total: { $sum: "$amountPaid" } } },
    ]);

    const successfulPayments = await Payment.countDocuments({ status: "Succeeded" });
    const pendingPayments = await Payment.countDocuments({ status: "Pending" });
    const failedPayments = await Payment.countDocuments({ status: "Failed" });
    const totalPayments = await Payment.countDocuments({});

    // Monthly revenue (last 12 months or current year - adjust as needed)
    const monthlyRevenue = await Payment.aggregate([
      { $match: { status: "Succeeded" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          revenue: { $sum: "$amountPaid" },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 12 },
    ]);

    // Recent payments (last 10)
    const recentPayments = await Payment.find({ status: "Succeeded" })
      .populate("bookingId", "tourName fullName")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      metrics: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalPayments,
        successfulPayments,
        pendingPayments,
        failedPayments,
        monthlyRevenue, // array of { _id: "YYYY-MM", revenue: number }
        recentPayments,
      },
    });
  } catch (error) {
    console.error("Error fetching payment metrics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch metrics",
      error: error.message,
    });
  }
};