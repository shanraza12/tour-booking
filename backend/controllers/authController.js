import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createLog } from './activityLogController.js';

// Register a new user
export const registerUser = async (req, res) => {
  const { username, fullName, email, password, photo, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ message: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Allow self-registration as 'agency' or default 'user'
    const assignedRole = role === 'agency' ? 'agency' : 'user';

    const newUser = new User({ username, fullName, email, password: hashedPassword, photo, role: assignedRole });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to register user' });
  }
};

export const registerAdmin = async (req, res) => {
  const { username, fullName, email, password, photo } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ message: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, role: 'admin', fullName, email, password: hashedPassword, photo });
    await newUser.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to register admin' });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

  try {
    const user = await User.findOne({ 
      $or: [{ email: email }, { username: email }] 
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).json({ message: 'Invalid credentials' });

    // Update lastLoginAt
    user.lastLoginAt = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user?.role }, process.env.JWT_SECRET, { expiresIn: '15d' });

    // Log the login activity
    await createLog({ userId: user._id, username: user.username, role: user.role, action: 'login', ipAddress: ip });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        photo: user.photo,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to login' });
  }
};

// Logout user
export const logoutUser = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (user) {
      user.lastLogoutAt = new Date();
      await user.save();
      await createLog({ userId: user._id, username: user.username, role: user.role, action: 'logout', ipAddress: ip });
    }
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to logout' });
  }
};

// Send OTP to user email
export const sendOTP = async (req, res) => {
  const { email } = req.body;
  // TODO: Implement OTP generation and email sending using nodemailer
  res.status(501).json({ message: "sendOTP logic not implemented yet" });
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  // TODO: Implement OTP verification logic
  res.status(501).json({ message: "verifyOTP logic not implemented yet" });
};

// Google OAuth Login
export const googleLogin = async (req, res) => {
  const { idToken } = req.body;
  // TODO: Implement Google token verification and user creation/login
  res.status(501).json({ message: "googleLogin logic not implemented yet" });
};

export default { registerUser, loginUser, logoutUser, sendOTP, verifyOTP, googleLogin };