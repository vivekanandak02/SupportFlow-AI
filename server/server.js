const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize DB (attempts MongoDB Atlas / local mongod, or falls back to robust local persistent store)
connectDB();

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
// Provide direct /api/classify endpoint as specified in requirements
app.use('/api/classify', require('./routes/aiRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'SupportFlow AI MERN API',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong on the server.'
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 SupportFlow AI Server running at http://localhost:${PORT}`);
  console.log(`📡 API Endpoints ready for Frontend at /api/...`);
  console.log(`=======================================================`);
});
