import express from 'express';
import { createOffering, getOfferingsByRoute, updateOffering, deleteOffering, getAgencyOfferings } from '../controllers/agencyOfferingController.js';
import verifyToken from '../utils/verifyToken.js';

const router = express.Router();

router.post('/create', verifyToken, createOffering);
router.put('/:id', verifyToken, updateOffering);
router.delete('/:id', verifyToken, deleteOffering);
router.get('/agency', verifyToken, getAgencyOfferings); 
router.get('/route/:tourId', getOfferingsByRoute); 

export default router;
