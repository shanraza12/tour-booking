import express from 'express';
import { registerUser, loginUser, registerAdmin, logoutUser, sendOTP, verifyOTP, googleLogin } from "../controllers/authController.js";
import verifyToken from '../utils/verifyToken.js';

const authRoute = express.Router();

authRoute.post('/register', registerUser);
authRoute.post('/login', loginUser);
authRoute.post('/logout', verifyToken, logoutUser);
authRoute.post('/admin/login', loginUser);
authRoute.post('/admin/register', registerAdmin);


authRoute.post('/send-otp', sendOTP);
authRoute.post('/verify-otp', verifyOTP);
authRoute.post('/google-login', googleLogin);



export default authRoute;
