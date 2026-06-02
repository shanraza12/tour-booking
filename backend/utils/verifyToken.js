import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const errorHandler = (res, statusCode, message) => {
  return res.status(statusCode).json({ message });
};

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // get actual token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId || decoded._id; // depending on your payload
    const user = await User.findById(userId);

    if (!user) return res.status(401).json({ message: "Invalid token" });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid token" });
  }
};


export const verifyUser = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return errorHandler(res, 403, 'Access denied');
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return errorHandler(res, 403, 'Access denied');
  }
};

export default verifyToken;
