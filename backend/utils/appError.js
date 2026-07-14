/**
 * Custom Error Class to handle operational errors.
 * Operational errors are anticipated errors, such as invalid input, unauthorized access,
 * or resources not found. Programming errors are unexpected bugs.
 */
class AppError extends Error {
  /**
   * @param {string} message - The error message
   * @param {number} statusCode - HTTP status code (e.g., 400, 404, 500)
   */
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    // Set status depending on status code (4xx is fail, 5xx is error)
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    // Flag to identify this as an operational error (useful in global error handler)
    this.isOperational = true;

    // Capture the stack trace, excluding this constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
