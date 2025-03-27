import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  listId: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
  description: { type: String },
  position: { type: Number, required: true }, // For drag-and-drop ordering
  userId: { type: String, required: true }, // Clerk user ID
  reminder: { type: Boolean, default: false }, 
  reminderTime: { type: Date } // Timestamp for reminder
});

export default mongoose.model('Task', TaskSchema);
