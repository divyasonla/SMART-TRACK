const authService = require('../services/authService');
const catchAsync = require('../utils/catchAsync');

/**
 * Controller to handle user registration.
 * Responds with 201 Created and the user document + token.
 */
const register = catchAsync(async (req, res, next) => {
  // Extract only needed fields to prevent parameter injection attacks
  const { name, email, password, role, campus, gender, joiningDate } = req.body;

  const result = await authService.registerUser({
    name,
    email,
    password,
    role,
    campus,
    gender,
    joiningDate,
  });

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: {
      user: result.user,
      token: result.token,
    },
  });
});

/**
 * Controller to handle user login.
 * Responds with 200 OK and the user document + token.
 */
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const result = await authService.loginUser(email, password);

  res.status(200).json({
    status: 'success',
    message: 'User logged in successfully',
    data: {
      user: result.user,
      token: result.token,
    },
  });
});

/**
 * Controller to get the profile of the currently logged-in user.
 */
const getProfile = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});

/**
 * Controller to test Admin-only access.
 */
const adminTest = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome Admin! You have access to this secure dashboard.',
  });
});

module.exports = {
  register,
  login,
  getProfile,
  adminTest,
};
