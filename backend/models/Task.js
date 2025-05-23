import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  listId:{ type: String, required: true }, // Changed to listId
  description: { type: String },
  position: { type: Number, required: true }, // For drag-and-drop ordering
  userId: { type: String, required: true }, // Clerk user ID
  reminder: { type: Boolean, default: false },
  reminderTime: { type: Date } // Timestamp for reminder
});

export default mongoose.model('Task', TaskSchema);
