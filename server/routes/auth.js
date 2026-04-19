import express from 'express';
import { Staff, Student } from '../models/index.js';

const router = express.Router();

// Staff Login
router.post('/staff/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const staff = await Staff.findOne({ email, password });

    if (!staff) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ 
      success: true, 
      user: { 
        id: staff._id, 
        email: staff.email, 
        name: staff.name, 
        role: staff.role 
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Staff Register
router.post('/staff/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const staff = new Staff({ email, password, name, role: role || 'teacher' });
    await staff.save();
    res.status(201).json({ success: true, user: { id: staff._id, email: staff.email, name: staff.name } });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Student Login
router.post('/student/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email, password });

    if (!student) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ 
      success: true, 
      user: { 
        id: student._id, 
        email: student.email, 
        name: student.name, 
        grade: student.grade 
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Student Register
router.post('/student/register', async (req, res) => {
  try {
    const { email, password, name, grade } = req.body;
    const student = new Student({ email, password, name, grade });
    await student.save();
    res.status(201).json({ success: true, user: { id: student._id, email: student.email, name: student.name, grade: student.grade } });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

export default router;