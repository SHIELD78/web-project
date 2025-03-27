import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk user ID
  organizationId: { type: String, required: true, index: true }, // Organization-specific logs
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', index: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', index: true },
  action: { type: String, required: true }, // Example: "Task Moved", "Reminder Set", "Task Created"
  timestamp: { type: Date, default: Date.now, index: true },
  metadata: { type: mongoose.Schema.Types.Mixed } // Optional field for extra details
});

// Creating an index for faster filtering by organization and timestamp
ActivityLogSchema.index({ organizationId: 1, timestamp: -1 });

export default mongoose.model('ActivityLog', ActivityLogSchema);
