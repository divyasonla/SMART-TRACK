const AppError = require('../utils/appError');

/**
 * Catch-all middleware for handling undefined endpoints (404 Not Found).
 * It creates a new AppError and forwards it using next().
 */
const notFound = (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(err);
};

module.exports = notFound;
