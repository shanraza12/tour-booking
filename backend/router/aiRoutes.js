// server/routes/aiRoutes.js
import express from 'express';
const aiRouter = express.Router();
import { handleSkyAgent } from '../controllers/aiController.js';

aiRouter.post('/sky/chat', handleSkyAgent);

export default aiRouter