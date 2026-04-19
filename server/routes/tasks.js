
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

const router = express.Router();

// Task Schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  concept: String,
  description: String,
  dueDate: Date,
  status: { type: String, enum: ['pending', 'submitted', 'in-progress', 'completed'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  responseText: String,
  responseImage: String, // URL or path to uploaded image
  submittedAt: Date,
  approvedAt: Date,
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);

// Get all tasks (optionally filter by createdBy or assignedTo)
router.get('/tasks', async (req, res) => {
  try {
    const { createdBy, assignedTo } = req.query;
    const filter = {};
    if (createdBy) filter.createdBy = createdBy;
    if (assignedTo) {
      filter.$or = [{ assignedTo }, { assignedTo: { $exists: false } }, { assignedTo: null }];
    }
    
    const tasks = await Task.find(filter)
      .populate('createdBy', 'name')
      .populate('assignedTo', 'name grade')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a task
router.post('/tasks', async (req, res) => {
  try {
    const { title, concept, description, dueDate, priority, assignedTo, createdBy } = req.body;
    const task = new Task({ title, concept, description, dueDate, priority, assignedTo, createdBy });
    await task.save();
    const populated = await Task.findById(task._id)
      .populate('createdBy', 'name')
      .populate('assignedTo', 'name grade');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a task
router.put('/tasks/:id', async (req, res) => {
  try {
    const { title, concept, description, dueDate, status, priority, assignedTo, responseText } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, concept, description, dueDate, status, priority, assignedTo, responseText, updatedAt: Date.now() },
      { new: true }
    ).populate('createdBy', 'name').populate('assignedTo', 'name grade');
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Student submits a response for a task (with optional image)
router.post('/tasks/:id/submit', upload.single('responseImage'), async (req, res) => {
  try {
    const { responseText } = req.body;
    let responseImage = undefined;
    if (req.file) {
      // Store relative path for frontend access
      responseImage = `/uploads/${req.file.filename}`;
    }
    if (!responseText || typeof responseText !== 'string' || !responseText.trim()) {
      return res.status(400).json({ error: 'Response is required' });
    }

    const updateObj = {
      responseText: responseText.trim(),
      submittedAt: Date.now(),
      status: 'submitted',
      updatedAt: Date.now(),
    };
    if (responseImage) updateObj.responseImage = responseImage;

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      updateObj,
      { new: true }
    ).populate('createdBy', 'name').populate('assignedTo', 'name grade');

    if (!updated) return res.status(404).json({ error: 'Task not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Staff approves a submitted task response
router.post('/tasks/:id/approve', async (req, res) => {
  try {
    const { approvedBy } = req.body || {};
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (task.status !== 'submitted') {
      return res.status(400).json({ error: 'Only submitted tasks can be approved' });
    }

    task.status = 'completed';
    task.approvedAt = new Date();
    if (approvedBy) task.approvedBy = approvedBy;
    task.updatedAt = new Date();
    await task.save();

    const populated = await Task.findById(task._id)
      .populate('createdBy', 'name')
      .populate('assignedTo', 'name grade');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a task
router.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
