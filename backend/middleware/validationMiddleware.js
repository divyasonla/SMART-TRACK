const { body, validationResult } = require('express-validator');
const AppError = require('../utils/appError');

/**
 * Middleware to check for validation errors after validators have run.
 * If errors exist, it formats them and forwards an AppError (400) to the global error handler.
 */
const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Collect all error messages into a single readable string
    const errorMessages = errors
      .array()
      .map((error) => error.msg)
      .join('. ');
    return next(new AppError(errorMessages, 400));
  }
  next();
};

/**
 * Validation rules for user registration.
 */
const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(), // Sanitizes the email (lowercases it, removes spaces)

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),

  body('campus')
    .trim()
    .notEmpty()
    .withMessage('Campus is required')
    .isIn(['Dantewada', 'Sarjapur', 'Kishanganj', 'Raigarh'])
    .withMessage('Campus must be Dantewada, Sarjapur, Kishanganj, or Raigarh'),

  body('gender')
    .trim()
    .notEmpty()
    .withMessage('Gender is required')
    .isIn(['Male', 'Female'])
    .withMessage('Gender must be either Male or Female'),

  body('joiningDate')
    .trim()
    .notEmpty()
    .withMessage('Joining date is required')
    .isISO8601()
    .withMessage('Please provide a valid date format (YYYY-MM-DD)'),

  body('role')
    .optional()
    .trim()
    .isIn(['Student', 'Mentor', 'Admin'])
    .withMessage('Role must be either Student, Mentor, or Admin'),

  validateResults,
];

/**
 * Validation rules for user login.
 */
const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  validateResults,
];

/**
 * Validation rules for goal creation/update.
 */
const validateGoal = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Goal title is required')
    .isLength({ max: 100 })
    .withMessage('Goal title cannot exceed 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Goal description is required'),

  body('expectedCompletionTime')
    .notEmpty()
    .withMessage('Expected completion time is required')
    .isNumeric()
    .withMessage('Expected completion time must be a number representing hours')
    .custom((val) => Number(val) >= 1)
    .withMessage('Expected completion time must be at least 1 hour'),

  body('deadline')
    .trim()
    .notEmpty()
    .withMessage('Deadline is required')
    .isISO8601()
    .withMessage('Please provide a valid date format (YYYY-MM-DD)'),

  body('priority')
    .trim()
    .notEmpty()
    .withMessage('Priority is required')
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be either Low, Medium, or High'),

  body('status')
    .optional()
    .trim()
    .isIn(['Draft', 'In Progress', 'Completed'])
    .withMessage('Status must be Draft, In Progress, or Completed'),

  validateResults,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateGoal,
};
