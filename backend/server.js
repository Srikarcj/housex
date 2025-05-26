const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3011',
    'http://localhost:3006',
    'http://localhost:3000',
    'https://buildpaint.vercel.app',
    'https://buildpaint-frontend.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "http://localhost:3006", "http://localhost:3000"]
    }
  }
}));
app.use(morgan('dev'));

// Health check endpoint - no auth required
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Database connection with optimized settings
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('Connected to MongoDB');
  // Start server only after successful database connection
  const PORT = process.env.PORT || 3001;
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}/api`);
  });

  // Handle server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please try a different port.`);
      process.exit(1);
    } else {
      console.error('Server error:', error);
    }
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Clerk authentication middleware
app.use(ClerkExpressWithAuth());

// Protected routes
app.use('/api/profile', require('./routes/profile.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/professionals', require('./routes/professional.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ 
      message: 'Please sign in to continue',
      error: 'Unauthenticated'
    });
  }
  
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  if (process.env.NODE_ENV === 'development') {
    process.exit(1);
  }
}); 