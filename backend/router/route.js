import express from 'express';
import Task from '../models/Task.js';
import List from '../models/List.js';
import Board from '../models/Board.js';
import ActivityLog from '../models/ActivityLog.js';
import nodemailer from 'nodemailer';

import { clerkMiddleware, requireAuth, getAuth, clerkClient } from '@clerk/express';

const router = express.Router();

router.use(clerkMiddleware({
  publishableKey:'pk_test_YWRlcXVhdGUtbGxhbWEtMTEuY2xlcmsuYWNjb3VudHMuZGV2JA',
  secretKey:'sk_test_rURx8R6IFHQWjf2Z5a5qkxzbNwdShb5bf4I4oWL7if'
}));
// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'harshdalmia08@gmail.com',
    pass: 'xcfi jaog qhso rtyx',
  },
});

// Task Routes
router.post('/tasks', async (req, res) => {
  const { title, boardId, listId, description, position } = req.body;
  const { userId } = getAuth(req);
  const task = new Task({ title, boardId, listId, description, position, userId, reminder: false });
  await task.save();
  res.json(task);
});

router.put('/tasks/:taskId', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true });
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

router.get('/tasks/:taskId', async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

router.delete('/tasks/:taskId',  async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json({ message: 'Task deleted' });
});

// Set task reminder and send email
router.post('/tasks/:taskId/reminder', async (req, res) => {
  const { userId } = getAuth(req);
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  task.reminder = true;
  
  await task.save();
  await ActivityLog.create({ userId, boardId: task.boardId, taskId: task._id, action: 'Set Reminder' });
  
  
  try{
  const user = await clerkClient.users.getUser(task.userId);
  const mailOptions = {
    from: process.env.EMAIL,
    to: user.emailAddresses[0].emailAddress,
    subject: 'Task Reminder',
    text: `Reminder: You have a pending task - ${task.title}`,
  };


    await transporter.sendMail(mailOptions);
    res.json({ message: 'Reminder set and email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending reminder email' });
  }
});

// List Routes
router.post('/lists', async (req, res) => {
  const { title, boardId, position } = req.body;
  const list = new List({ title, boardId, position });
  await list.save();
  res.json(list);
});

router.put('/lists/:listId',async (req, res) => {
  const list = await List.findByIdAndUpdate(req.params.listId, req.body, { new: true });
  res.json(list);
});

router.delete('/lists/:listId',  async (req, res) => {
  const list = await List.findByIdAndDelete(req.params.listId);
  if (!list) return res.status(404).json({ error: 'List not found' });
  res.json({ message: 'List deleted' });
});

// Board Routes
router.post('/boards',  async (req, res) => {
  const { title,  organizationId, imageUrl } = req.body;
  const { userId } = getAuth(req);
  const board = new Board({ title, owner:userId, organizationId, imageUrl, members: [userId] });
  await board.save();
  res.json(board);
});

router.get('/boards/:organizationId', async (req, res) => {
  const boards = await Board.find({ organizationId: req.params.organizationId });
  res.json(boards);
});

router.delete('/boards/:boardId',  async (req, res) => {
  const board = await Board.findByIdAndDelete(req.params.boardId);
  if (!board) return res.status(404).json({ error: 'Board not found' });
  res.json({ message: 'Board deleted' });
});

// Activity Log Routes
// Fetch all activity logs for an organization
router.get('/activity/organization/:organizationId',  async (req, res) => {
  const organizationId = req.params.organizationId;
    const logs = await ActivityLog.find({ organizationId }).sort({ timestamp: -1 });
    res.json(logs);
  });
  
  // Fetch activity logs for a specific board
  router.get('/activity/board/:boardId',async (req, res) => {
    const logs = await ActivityLog.find({ boardId: req.params.boardId }).sort({ timestamp: -1 });
    res.json(logs);
  });
  
  // Fetch activity logs for a specific task
  router.get('/activity/task/:taskId',  async (req, res) => {
    const logs = await ActivityLog.find({ taskId: req.params.taskId }).sort({ timestamp: -1 });
    res.json(logs);
  });
  
  // Fetch aggregated activity log data for charts (organization level)
  router.get('/activity/organization/:organizationId/chart', async (req, res) => {
    const logs = await ActivityLog.aggregate([
      { $match: { organizationId: req.params.organizationId } },
      { $group: { _id: "$action", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json(logs);
  });
  
// Organization Routes
router.get('/organizations',  async (req, res) => {
  const { userId } = getAuth(req);
  
  try {
    const userOrganizations = await clerkClient.organizations.getOrganizationMembershipList({ userId });
    res.json(userOrganizations);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching organizations' });
  }
});

export default router;
