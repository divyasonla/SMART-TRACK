const { verifyToken } = require('../utils/tokenUtils');
const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/**
 * Middleware to authenticate requests.
 * Checks for a JWT token in the Authorization header, verifies it,
 * and attaches the authenticated user to the request object.
 */
const protect = catchAsync(async (req, res, next) => {
  // 1. Get the token from headers
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Check if token exists
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 3. Verify token (will throw JsonWebTokenError or TokenExpiredError if invalid, handled globally)
  const decoded = await verifyToken(token);

  // 4. Check if user still exists in the database
  const currentUser = await userRepository.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );
  }

  // 5. Grant access to protected route and attach user to request object
  req.user = currentUser;
  next();
});

/**
 * Middleware to authorize roles.
 * Restricts access to specific user roles.
 * @param {...string} roles - List of allowed roles (e.g., 'Admin', 'Mentor')
 * @returns {Function} Express middleware function
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role is in the list of allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }
    next();
  };
};

module.exports = {
  protect,
  restrictTo,
};
