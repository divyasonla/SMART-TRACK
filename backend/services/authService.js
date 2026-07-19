const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const otpRepository = require('../repositories/otpRepository');
const { sendOtpEmail } = require('../config/nodemailer');
const { generateOtp } = require('../utils/otpGenerator');
const {
  isValidEmail,
  isValidPassword,
  doPasswordsMatch,
  isValidOtp
} = require('../utils/validators');

class AuthService {
  /**
   * User Signup Business Logic
   */
  async signup({ fullName, email, password, confirmPassword }) {
    // 1. Input validations
    if (!fullName || !fullName.trim()) {
      throw { status: 400, message: 'Full name is required' };
    }

    if (!isValidEmail(email)) {
      throw { status: 400, message: 'Please provide a valid email address' };
    }

    if (!isValidPassword(password)) {
      throw { status: 400, message: 'Password must be at least 8 characters long' };
    }

    if (!doPasswordsMatch(password, confirmPassword)) {
      throw { status: 400, message: 'Password and Confirm Password do not match' };
    }

    // 2. Check for duplicate email
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw { status: 400, message: 'Email address is already registered' };
    }

    // 3. Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Save user to repository
    const newUser = await userRepository.createUser({
      fullName,
      email,
      password: hashedPassword
    });

    return {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      createdAt: newUser.createdAt
    };
  }

  /**
   * User Login Business Logic
   */
  async login({ email, password }) {
    // 1. Input validations
    if (!isValidEmail(email)) {
      throw { status: 400, message: 'Please provide a valid email address' };
    }

    if (!password) {
      throw { status: 400, message: 'Password is required' };
    }

    // 2. Find user by email
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw { status: 401, message: 'Invalid email or password' };
    }

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { status: 401, message: 'Invalid email or password' };
    }

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email
    };
  }

  /**
   * Forgot Password - Generate & Send OTP
   */
  async forgotPassword(email) {
    // 1. Input validation
    if (!isValidEmail(email)) {
      throw { status: 400, message: 'Please enter a valid email address' };
    }

    // 2. Check if user exists
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw { status: 444, statusCode: 404, message: 'User not found' };
    }

    // 3. Generate 6-digit OTP
    const otp = generateOtp();

    // 4. Save OTP to repository with 5-minute expiration
    await otpRepository.saveOtp(email, otp, 5);

    // 5. Send OTP via Nodemailer
    const mailResult = await sendOtpEmail(user.email, otp);

    return {
      email: user.email,
      message: mailResult.message || 'OTP has been sent to your registered email address'
    };
  }

  /**
   * Verify OTP Code
   */
  async verifyOtp({ email, otp }) {
    // 1. Input validation
    if (!isValidEmail(email)) {
      throw { status: 400, message: 'Valid email is required' };
    }

    if (!isValidOtp(otp)) {
      throw { status: 400, message: 'OTP must be exactly 6 digits' };
    }

    // 2. Retrieve saved OTP record
    const otpRecord = await otpRepository.findByEmail(email);

    if (!otpRecord) {
      throw { status: 400, message: 'No OTP request found for this email. Please request a new OTP' };
    }

    // 3. Check expiration (5 minutes = 300,000 ms)
    if (Date.now() > otpRecord.expiresAt) {
      await otpRepository.deleteOtp(email);
      throw { status: 400, message: 'OTP has expired. Please request a new OTP' };
    }

    // 4. Verify match
    if (otpRecord.otp !== String(otp).trim()) {
      throw { status: 400, message: 'Incorrect OTP. Please check and try again' };
    }

    // 5. Mark OTP as verified
    await otpRepository.markVerified(email);

    return {
      email: otpRecord.email,
      isVerified: true,
      message: 'OTP verified successfully'
    };
  }

  /**
   * Reset Password with Verified OTP
   */
  async resetPassword({ email, newPassword, confirmPassword }) {
    // 1. Validations
    if (!isValidEmail(email)) {
      throw { status: 400, message: 'Valid email is required' };
    }

    if (!isValidPassword(newPassword)) {
      throw { status: 400, message: 'Password must be at least 8 characters long' };
    }

    if (!doPasswordsMatch(newPassword, confirmPassword)) {
      throw { status: 400, message: 'New Password and Confirm Password do not match' };
    }

    // 2. Check if user exists
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    // 3. Check OTP verification status
    const otpRecord = await otpRepository.findByEmail(email);
    if (!otpRecord || !otpRecord.isVerified) {
      throw { status: 400, message: 'OTP verification required before resetting password' };
    }

    // 4. Hash new password
    const saltRounds = 10;
    const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // 5. Update user password in repository
    await userRepository.updatePassword(email, newHashedPassword);

    // 6. Clear OTP record after successful reset
    await otpRepository.deleteOtp(email);

    return {
      email: user.email,
      message: 'Password reset successful. You can now log in with your new password'
    };
  }
}

module.exports = new AuthService();
