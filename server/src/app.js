const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { CLIENT_URL } = require('./config/env');
const { apiLimiter } = require('./middleware/rateLimiter');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { getDBStatus } = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const aiRoutes = require('./routes/aiRoutes');
const eligibilityRoutes = require('./routes/eligibilityRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const knowledgeRoutes = require('./routes/knowledgeRoutes');
const helplineRoutes = require('./routes/helplineRoutes');
const adminRoutes = require('./routes/adminRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');

const app = express();

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
  })
);

// CORS configuration
app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    platform: 'BOLO - Voice Help for Everyday Government Services',
    timestamp: new Date().toISOString(),
    database: getDBStatus(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Rate limiting for standard API endpoints
app.use('/api', apiLimiter);

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/eligibility', eligibilityRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/helplines', helplineRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/volunteer', volunteerRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
