const AppError = require('../utils/appError');

/**
 * Handles CastError from Mongoose (e.g., passing an invalid Object ID)
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

/**
 * Handles Duplicate Key Error from MongoDB (e.g., trying to register an email that already exists)
 */
const handleDuplicateFieldsDB = (err) => {
  // Extract duplicate value using regex from the error message
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

/**
 * Handles Mongoose ValidationErrors (e.g., missing required fields, value out of range)
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(' ')}`;
  return new AppError(message, 400);
};

/**
 * Formats and sends detailed error details for developers
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

/**
 * Sends clean, secure error responses in a production environment
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak details to client
    console.error('ERROR 💥:', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our end. Please try again later.',
    });
  }
};

/**
 * Centralized global Express error handler middleware.
 * Express detects this as an error-handling middleware because it accepts EXACTLY four arguments.
 */
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = Object.create(err); // Create a copy of the error object
    error.message = err.message;
    error.stack = err.stack;

    // Convert common MongoDB/Mongoose errors into AppError operational errors
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};
