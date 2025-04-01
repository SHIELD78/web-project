import express from 'express';
import Task from './models/Task';
import List from './models/List';
import { getAuth } from './utils/auth'; // Your authentication utility

const router = express.Router();

// Task Routes
router.get('/tasks', async (req, res) => {
  const { listId } = req.query;
  if (!listId) return res.status(400).json({ error: 'listId is required' });

  const tasks = await Task.find({ listId });
  if (!tasks || tasks.length === 0) return res.status(404).json({ error: 'No tasks found for this list' });

  res.json(tasks);
});

router.post('/tasks', async (req, res) => {
  const { title, listId, description, position } = req.body;
  const { userId } = getAuth(req);

  // Check if listId exists
  const list = await List.findById(listId);
  if (!list) return res.status(404).json({ error: 'List not found' });

  const task = new Task({ title, listId, description, position, userId, reminder: false });
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

router.delete('/tasks/:taskId', async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json({ message: 'Task deleted' });
});

// List Routes
router.post('/lists', async (req, res) => {
  const { title, boardId, position } = req.body;
  const list = new List({ title, boardId, position });
  await list.save();
  res.json(list);
});

router.put('/lists/:listId', async (req, res) => {
  const list = await List.findByIdAndUpdate(req.params.listId, req.body, { new: true });
  res.json(list);
});

router.delete('/lists/:listId', async (req, res) => {
  const list = await List.findByIdAndDelete(req.params.listId);
  if (!list) return res.status(404).json({ error: 'List not found' });

  // Delete all tasks associated with the list
  await Task.deleteMany({ listId: req.params.listId });
  res.json({ message: 'List and its tasks deleted' });
});

export default router;
