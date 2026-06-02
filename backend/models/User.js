import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // Optional for OAuth users
    },
    photo: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'agency', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    lastLoginAt: {
      type: Date,
    },
    lastLogoutAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);