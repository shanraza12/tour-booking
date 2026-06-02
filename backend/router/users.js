import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCustomers,
  getAdmins,
  uploadUserPhotos
} from "../controllers/userController.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";
import upload from "../middleware/multer.js";

const userRoute = express.Router();

userRoute.post("/", verifyAdmin, createUser);

userRoute.get("/", verifyAdmin, getAllUsers);
userRoute.post("/customers", verifyAdmin, getCustomers);
userRoute.post("/getAdmins", verifyAdmin, getAdmins);

userRoute.get("/:id", verifyUser, getUserById);
  
userRoute.post("/update", verifyUser, updateUser);
userRoute.post("/user-photo", upload.single("photo"), uploadUserPhotos);
userRoute.delete("/:id", verifyUser, deleteUser);

export default userRoute;
