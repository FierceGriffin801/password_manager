require('dotenv').config();
console.log('Loaded environment variables:', process.env);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Check for required environment variables
if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET not set. Using fallback key.');
}

const app = express();

// Allow only your Vercel frontend domain
const allowedOrigins = [
  'https://password-manager-gray-eight.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// Explicitly handle preflight requests for all routes
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://adityasrivastava9march:Aditya%23123@password-manager.fcnunu6.mongodb.net/?retryWrites=true&w=majority&appName=password-manager';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Please make sure MongoDB is running on your system.');
    process.exit(1);
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/passwords', require('./routes/passwords'));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Password Manager API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
}); 