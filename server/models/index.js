import mongoose from 'mongoose';

// Staff Schema
const staffSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['teacher', 'admin'], default: 'teacher' },
  createdAt: { type: Date, default: Date.now }
});

// Student Schema
const studentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  grade: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Concept Schema (for tracking academic concepts)
const conceptSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  createdAt: { type: Date, default: Date.now }
});

// Mastery Tracking Schema
const masterySchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  concept: { type: mongoose.Schema.Types.ObjectId, ref: 'Concept', required: true },
  masteryLevel: { type: Number, min: 0, max: 100, default: 0 },
  lastAssessed: { type: Date, default: Date.now },
  notes: String
});

// Assignment Schema
const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  concept: { type: mongoose.Schema.Types.ObjectId, ref: 'Concept' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  dueDate: Date,
  createdAt: { type: Date, default: Date.now }
});

export const Staff = mongoose.model('Staff', staffSchema);
export const Student = mongoose.model('Student', studentSchema);
export const Concept = mongoose.model('Concept', conceptSchema);
export const Mastery = mongoose.model('Mastery', masterySchema);
export const Assignment = mongoose.model('Assignment', assignmentSchema);