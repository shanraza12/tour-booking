import express from "express";
import { createTour,deleteSingleTour,uploadTourPhotos, deleteTour, getAllTour, getFeaturedTour, getSingleTour, getTourCount, updateTour } from "../controllers/tourController.js";
import verifyToken, { verifyAdmin } from "../utils/verifyToken.js";
import upload from "../middleware/multer.js";

const tourRoute = express.Router();

// Route for getting featured tours
tourRoute.get("/featured", getFeaturedTour);

tourRoute.get("/:id", getSingleTour);
tourRoute.delete("/delete/:id", deleteSingleTour);

tourRoute.post("/create", verifyToken, verifyAdmin, createTour);

tourRoute.post("/update", verifyToken, verifyAdmin, updateTour);

tourRoute.delete("/:id", deleteTour);

tourRoute.post("/", getAllTour);
tourRoute.get("/", getAllTour);

tourRoute.get("/count", getTourCount);

tourRoute.post("/tour-photo", upload.single("photo"), uploadTourPhotos);

export default tourRoute;
