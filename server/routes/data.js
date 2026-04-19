import express from 'express';
import { Concept, Mastery, Student } from '../models/index.js';

const router = express.Router();

// Get all concepts
router.get('/concepts', async (req, res) => {
  try {
    const concepts = await Concept.find().populate('createdBy', 'name');
    res.json(concepts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create concept (staff only)
router.post('/concepts', async (req, res) => {
  try {
    const { name, subject, description, createdBy } = req.body;
    const concept = new Concept({ name, subject, description, createdBy });
    await concept.save();
    res.status(201).json(concept);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get student mastery data
router.get('/mastery/student/:studentId', async (req, res) => {
  try {
    const mastery = await Mastery.find({ student: req.params.studentId })
      .populate('concept');
    res.json(mastery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update mastery
router.post('/mastery', async (req, res) => {
  try {
    const { student, concept, masteryLevel, notes } = req.body;
    let mastery = await Mastery.findOne({ student, concept });
    
    if (mastery) {
      mastery.masteryLevel = masteryLevel;
      mastery.notes = notes;
      mastery.lastAssessed = Date.now();
    } else {
      mastery = new Mastery({ student, concept, masteryLevel, notes });
    }
    
    await mastery.save();
    res.json(mastery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all students (for staff)
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find().select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;