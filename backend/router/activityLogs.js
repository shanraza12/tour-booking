import express from 'express';
import { getActivityLogs, getLogsByRole } from '../controllers/activityLogController.js';
import { verifyAdmin } from '../utils/verifyToken.js';

const logRouter = express.Router();

// Admin only — get all logs, optionally filtered
logRouter.get('/', verifyAdmin, getActivityLogs);

// Admin only — get logs by specific role
logRouter.get('/role/:role', verifyAdmin, getLogsByRole);

export default logRouter;
