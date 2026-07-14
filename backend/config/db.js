const mongoose = require('mongoose');

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * Connects asynchronously and handles connection event listeners for robustness.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    // Exit the process with failure code if connection fails initially
    process.exit(1);
  }
};

// Event Listeners for continuous monitoring of the Mongoose connection
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB connection disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err.message}`);
});

module.exports = connectDB;
