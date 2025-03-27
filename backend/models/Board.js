import mongoose from 'mongoose';

const BoardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner: { type: String, required: true }, // Clerk user ID
  organizationId: { type: String, required: true }, // Clerk organization ID
  members: [{ type: String }], // List of Clerk user IDs
  imageUrl: { type: String }
});

export default mongoose.model('Board', BoardSchema);
