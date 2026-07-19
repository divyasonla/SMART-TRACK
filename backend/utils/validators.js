const validator = require('validator');

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return validator.isEmail(email.trim());
};

/**
 * Validate password length (min 8 chars)
 */
const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 8;
};

/**
 * Check if password and confirmPassword match
 */
const doPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Validate 6-digit OTP format
 */
const isValidOtp = (otp) => {
  if (!otp) return false;
  const strOtp = String(otp).trim();
  return /^\d{6}$/.test(strOtp);
};

module.exports = {
  isValidEmail,
  isValidPassword,
  doPasswordsMatch,
  isValidOtp
};
