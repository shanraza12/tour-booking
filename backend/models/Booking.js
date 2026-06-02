import mongoose from "mongoose";

const generateTicketNumber = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "SKY-";
  for (let i = 0; i < 8; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
};

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    tourName: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    bookAt: { type: Date, required: true },
    groupSize: { type: Number, required: true },
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: "Tour" },
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    offeringId: { type: mongoose.Schema.Types.ObjectId, ref: "AgencyOffering", default: null },
    ticketNumber: {
      type: String,
      unique: true,
      default: generateTicketNumber,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);