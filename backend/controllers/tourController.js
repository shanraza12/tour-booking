import Tour from "../models/Tour.js";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: "didjdktx9",
  api_key: "614217476572916",
  api_secret: "PN5ECfLa2VL3_pAO_ZgYau8UqD0",
});
// create new tour
export const createTour = async (req, res) => {
  try {
    const newTour = new Tour(req.body);
    const savedTour = await newTour.save();
    res.status(200).json({
      success: true,
      message: "Successfully created",
      data: savedTour,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create tour" });
  }
};

// update tour
// controllers/tourController.js
export const updateTour = async (req, res) => {
  // Extract ONLY the id from the body
  const { id, ...updateData } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Tour ID is required for update",
    });
  }

  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      id,           // ← correct: just the ID string
      updateData,   // ← the actual fields to update
      { 
        new: true,
        runValidators: true,  // important: enforce required fields
      }
    );

    if (!updatedTour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tour updated successfully",
      data: updatedTour,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update tour",
      error: err.message,
    });
  }
};
// delete tour
export const deleteTour = async (req, res) => {
  const id = req.params.id;
  try {
    await Tour.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Tour deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete tour" });
  }
};

// get single tour
export const getSingleTour = async (req, res) => {
  const id = req.params.id;
  try {
    const tour = await Tour.findById(id);
    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Tour retrieved successfully",
      data: tour,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to get the tour" });
  }
};


export const deleteSingleTour = async (req, res) => {
  const id = req.params.id;

  try {
    // First check if the tour exists
    const tour = await Tour.findById(id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    // Delete the tour
    await Tour.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Tour deleted successfully",
      data: null, // or you can return the deleted tour if you want
    });
  } catch (err) {
    console.error("Error deleting tour:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete the tour",
    });
  }
};

// get all tours
export const getAllTour = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      success: true,
      count: tours.length,
      message: "Tours retrieved successfully",
      data: tours,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to get tours" });
  }
};

export const getFeaturedTour = async (req, res) => {
  try {
    const tours = await Tour.find({ featured: true });
    res.status(200).json({
      success: true,
      message: "Tours retrieved successfully",
      data: tours,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to get tours" });
  }
};

export const getTourCount = async (req, res) => {
  try {
    const tourCount = await Tour.estimatedDocumentCount();
    res.status(200).json({
      success: true,
      message: "Tours count successfully",
      data: tourCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to get tours count" });
  }
};



export default {
  createTour,
  deleteTour,
  updateTour,
  getSingleTour,
  getAllTour,
  getFeaturedTour,
  getTourCount,
};


export const uploadTourPhotos = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded" });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "tour-posts" }, // organized folder
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    res.status(200).json({
      message: "Photo uploaded successfully",
      url: result.secure_url, // this exact key is used in frontend
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload photo" });
  }
};