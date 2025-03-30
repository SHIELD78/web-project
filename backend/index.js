import express from 'express';
import mongoose from 'mongoose';

import cors from 'cors';
import router from './router/route.js';// Single file for all routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', router); // All routes are handled in one file

// Connect to MongoDB
mongoose.connect('mongodb+srv://harsh:H%40rshdalmia@login.jypzsqf.mongodb.net/')
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Start the server
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
