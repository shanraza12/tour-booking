// userController.js

import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: "didjdktx9",
  api_key: "614217476572916",
  api_secret: "PN5ECfLa2VL3_pAO_ZgYau8UqD0",
});
// Create a new user
export const createUser = async (req, res) => {
  try {
    const newUser = new User({
      ...req.body,
      role: "admin", // set role here
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: savedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create user" });
  }
};


// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to get users" });
  }
};
export const getCustomers = async (req, res) => {
  try {
    const users = await User.find({role:"user"});
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to get users" });
  }
};
export const getAdmins = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ["admin", "agency"] } });
    res.status(200).json({
      success: true,
      message: "Staff retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to get staff" });
  }
};

// Get a single user by ID
export const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to get user" });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  const { id, ...rest } = req.body; // destructure id from body
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: rest }, 
      { new: true } 
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
};


// Delete a user
export const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};



export const uploadUserPhotos = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded" });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "user-photos" }, // organized folder
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