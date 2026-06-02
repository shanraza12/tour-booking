import Review from "../models/Review.js";
import Tour from "../models/Tour.js";

import AgencyOffering from "../models/AgencyOffering.js";

// Create a new review
export const createReview = async (req, res) => {
  const { username, rating, reviewText, reviewType } = req.body;
  const { TourId } = req.params;
  
  if (!username || !rating || !reviewText) {
    return res.status(400).json({ message: "Username, rating, and reviewText are required fields" });
  }

  try {
    let targetEntity;
    const isAgencyReview = reviewType === 'agency';
    
    if (isAgencyReview) {
      targetEntity = await AgencyOffering.findById(TourId);
    } else {
      targetEntity = await Tour.findById(TourId);
    }

    if (!targetEntity) {
      return res.status(404).json({ message: "Target entity not found" });
    }

    const newReview = new Review({
      [isAgencyReview ? 'agencyOffering' : 'tour']: targetEntity._id,
      reviewType: isAgencyReview ? 'agency' : 'tour',
      username: username,
      reviewText: reviewText,
      rating,
    });

    await newReview.save();
    targetEntity.reviews.push(newReview);
    
    if (isAgencyReview) {
      // update agency average rating if desired, but storing in array is fine
      const totalRating = targetEntity.reviews.reduce((acc, item) => acc + item.rating, 0);
      targetEntity.ratings = totalRating / targetEntity.reviews.length;
    }

    await targetEntity.save();
    res.status(201).json({ message: "Review created successfully", data: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create review" });
  }
};

// Get all reviews for a tour
export const getTourReviews = async (req, res) => {
  const { TourId } = req.params;

  try {
    // Check if the tour exists
    const tour = await Tour.findById(TourId);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    // Get all reviews for the tour
    const reviews = await Review.find({ tour: TourId });

    res.status(200).json({
      count: reviews.length,
      message: "Reviews retrieved successfully",
      data: reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get tour reviews" });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    // Check if the review exists
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await Review.findByIdAndDelete(reviewId);

    const tourId = review.tour;
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    const updatedReviews = tour.reviews.filter(
      (tourReview) => tourReview.toString() !== reviewId
    );

    tour.reviews = updatedReviews;
    await tour.save();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete review" });
  }
};
