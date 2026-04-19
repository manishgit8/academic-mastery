
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import dataRoutes from './routes/data.js';
import taskRoutes from './routes/tasks.js';
import aiRoutes from './routes/ai.js';
// Session and passport removed - Google OAuth disabled

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://academic-mastery-3.vercel.app', // production Vercel domain
    'https://academic-mastery-zeta.vercel.app', // fallback for preview deployments
  ],
  credentials: true,
}));
app.use(express.json());
// Serve uploaded images statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Session middleware disabled

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school-portal';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    console.log('   Database:', mongoose.connection.name);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// Routes
app.use('/api', authRoutes);
app.use('/api', dataRoutes);
app.use('/api', taskRoutes);
app.use('/api', aiRoutes);
// Google auth routes removed

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'School Portal API is running',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    database: mongoose.connection.name
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
