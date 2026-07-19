const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Mount authentication routes (supports both /api/signup and /signup)
app.use('/api', authRoutes);
app.use('/', authRoutes);

// Fallback to login.html for root route if requested directly
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'login.html'));
});

// Start server with fallback port handling
const startServer = (portToUse) => {
  const server = app.listen(portToUse, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Authentication Server running on http://localhost:${portToUse}`);
    console.log(`📁 Serving frontend from: ${frontendPath}`);
    console.log(`======================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = Number(portToUse) + 1;
      console.warn(`⚠️ Port ${portToUse} is in use, attempting to start on port ${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer(PORT);
