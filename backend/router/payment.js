import express from 'express';
import upload from "../middleware/multer.js";
import {getPaymentMetrics,getPaymentById,getAllPayments} from '../controllers/paymentController.js';

const paymentRoute = express.Router();

paymentRoute.get("/", getAllPayments);
paymentRoute.get("/metrics", getPaymentMetrics);
paymentRoute.get("/:id", getPaymentById);

export default paymentRoute;
