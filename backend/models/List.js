import mongoose from 'mongoose';

const ListSchema = new mongoose.Schema({
  title: { type: String, required: true },
  boardId: { type: String, required: true },

  position: { type: Number, required: true }, // For ordering lists
});

export default mongoose.model('List', ListSchema);
