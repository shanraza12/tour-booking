import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: { type: String, required: true },
    role: {
      type: String,
      enum: ['user', 'agency', 'admin'],
      required: true,
    },
    action: {
      type: String,
      enum: ['login', 'logout', 'booking', 'profile_update', 'tour_view'],
      required: true,
    },
    ipAddress: { type: String, default: 'unknown' },
    details: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('ActivityLog', activityLogSchema);
