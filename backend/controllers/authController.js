const authService = require('../services/authService');

/**
 * Signup / Register controller
 */
const signup = async (req, res) => {
  try {
    const { fullName, name, email, password, confirmPassword } = req.body;
    const userFullName = fullName || name;
    const userConfirmPass = confirmPassword || password;

    const userData = await authService.signup({
      fullName: userFullName,
      email,
      password,
      confirmPassword: userConfirmPass
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Please log in.',
      data: userData
    });
  } catch (error) {
    const status = error.status || error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || 'An error occurred during registration'
    });
  }
};

const register = signup;

/**
 * Login controller
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await authService.login({ email, password });

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      data: userData
    });
  } catch (error) {
    const status = error.status || error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || 'An error occurred during login'
    });
  }
};

/**
 * Forgot Password controller
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: { email: result.email }
    });
  } catch (error) {
    const status = error.status || error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || 'An error occurred while requesting OTP'
    });
  }
};

/**
 * Verify OTP controller
 */
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyOtp({ email, otp });

    return res.status(200).json({
      success: true,
      message: result.message,
      data: { email: result.email, isVerified: result.isVerified }
    });
  } catch (error) {
    const status = error.status || error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || 'An error occurred while verifying OTP'
    });
  }
};

/**
 * Reset Password controller
 */
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, password, confirmPassword } = req.body;
    const userNewPassword = newPassword || password;
    const userConfirmPassword = confirmPassword || userNewPassword;

    const result = await authService.resetPassword({
      email,
      newPassword: userNewPassword,
      confirmPassword: userConfirmPassword
    });

    return res.status(200).json({
      success: true,
      message: result.message,
      data: { email: result.email }
    });
  } catch (error) {
    const status = error.status || error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || 'An error occurred while resetting password'
    });
  }
};

module.exports = {
  signup,
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword
};