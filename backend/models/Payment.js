import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    amountPaid: { type: Number, required: true }, // in dollars (not cents)
    status: { type: String, enum: ["Pending", "Succeeded", "Failed"], default: "Pending" },
    paymentIntentId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);