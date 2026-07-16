const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/**
 * Middleware to protect routes.
 * Ensures the request contains a valid JWT in the Authorization header.
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'You are not logged in. Please log in to get access.',
      });
    }

    // 2. Verify token signature and expiration
    const secret = process.env.JWT_SECRET || 'defaultsecret';
    const decoded = jwt.verify(token, secret);

    // 3. Verify user still exists in the database
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    // 4. Attach user to request object
    req.user = currentUser;
    next();
  } catch (err) {
    let msg = 'Invalid or expired token. Please log in again.';
    if (err.name === 'TokenExpiredError') {
      msg = 'Your session has expired. Please log in again.';
    }
    return res.status(401).json({
      success: false,
      message: msg,
    });
  }
};
