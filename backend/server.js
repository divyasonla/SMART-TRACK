// Load environment variables early in the lifecycle
const dotenv = require('dotenv');
dotenv.config();

// Handle uncaught exceptions (synchronous bugs that weren't caught anywhere)
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  // Exit immediately because the Node process is in an unclean state
  process.exit(1);
});

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');

const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// Initialize the Express application
const app = express();

// --- 1. Database Connection ---
connectDB();

// --- 2. Security & Utility Middlewares ---
// Secure HTTP headers with helmet
app.use(helmet());

// Enable Cross-Origin Resource Sharing
app.use(cors());

// HTTP Request logging (Morgan) - only in development for clean production logs
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  app.use(morgan('dev'));
}

// --- 3. Request Body Parsers ---
// Parse incoming requests with JSON payloads (max 10kb to prevent DOS)
app.use(express.json({ limit: '10kb' }));
// Parse URL-encoded bodies (form data submissions)
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// --- 4. Static Files ---
// Serve files from the public folder (e.g. documentation, uploads, assets)
app.use(express.static(path.join(__dirname, 'public')));

// --- 5. Base & API Routes ---
// Health check endpoint (helpful for load balancers or docker container health checks)
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the Production-Ready Backend API Starter!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mounted API routes
app.use('/api/v1/tasks', taskRoutes);

// --- 6. Error Handling Middlewares ---
// Fallback route for resources not found (404)
app.use(notFound);

// Centralized error handler to catch all errors passed to next()
app.use(errorHandler);

// --- 7. Server Initialization ---
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});

// Handle unhandled promise rejections (asynchronous promises that failed without a .catch block)
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down gracefully...');
  console.error(err.name, err.message);
  // Gracefully close the server and release ports before exiting
  server.close(() => {
    process.exit(1);
  });
});
