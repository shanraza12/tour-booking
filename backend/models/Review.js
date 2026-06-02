import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Types.ObjectId,
      ref: "Tour",
    },
    agencyOffering: {
      type: mongoose.Types.ObjectId,
      ref: "AgencyOffering",
    },
    reviewType: {
      type: String,
      enum: ['tour', 'agency'],
      default: 'tour',
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    username: {
      type: String,
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
