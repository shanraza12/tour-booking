import ActivityLog from '../models/ActivityLog.js';
import User from '../models/User.js';

// Get all logs with optional filters
export const getActivityLogs = async (req, res) => {
  try {
    const { role, action, startDate, endDate, userId } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (action) filter.action = action;
    if (userId) filter.userId = userId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const logs = await ActivityLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(500)
      .populate('userId', 'username email role');

    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get logs by role (agency or user/client)
export const getLogsByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const logs = await ActivityLog.find({ role })
      .sort({ createdAt: -1 })
      .limit(200);
    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Internal helper — not a route handler
export const createLog = async ({ userId, username, role, action, ipAddress, details }) => {
  try {
    await ActivityLog.create({ userId, username, role, action, ipAddress: ipAddress || 'unknown', details: details || '' });
  } catch (e) {
    console.error('ActivityLog error:', e.message);
  }
};
