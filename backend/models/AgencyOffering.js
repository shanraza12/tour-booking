import mongoose from "mongoose";

const agencyOfferingSchema = new mongoose.Schema(
  {
    masterTour: {
      type: mongoose.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    agency: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    seatLimit: {
      type: Number,
      required: true,
    },
    boardingPlace: {
      type: String,
      required: true,
    },
    departureTime: {
      type: String,
      required: true,
    },
    comfortLevel: {
      type: String,
      enum: ["Luxury", "Standard", "Economy"],
      required: true,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        username: { type: String },
        rating: { type: Number },
        reviewText: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("AgencyOffering", agencyOfferingSchema);
