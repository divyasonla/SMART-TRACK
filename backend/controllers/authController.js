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
exports.register = async (req, res) => {
  try {
    const { name, email, password, campus, gender, batch } = req.body;

    if (!name || !email || !password || !campus || !gender) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Create User document (pre-save hook will hash password)
    const user = await User.create({
      name,
      email,
      password,
      campus,
      gender,
    });

    // Generate JWT token for the newly registered user
    const token = generateToken(user._id);

    // Exclude password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      data: userResponse,
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

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
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // Exclude password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "Login Successful",
      data: userResponse,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Controller to get user profile.
 */
exports.getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Controller to handle forgot password.
 * Generates OTP and sends reset email (or logs to console if SMTP not configured).
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate a 6-digit OTP
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save({ validateBeforeSave: false });

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT) || 587;
    const fromEmail = process.env.SMTP_FROM || "divyasonla@navgurukul.org";
    const emailBody = `Your OTP for resetting your password is: ${resetToken}. It will expire in 15 minutes.`;

    if (!host || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log("=========================================");
      console.log("⚠️ SMTP credentials not fully configured in .env. OTP logged to console:");
      console.log(`🔑 OTP for ${email}: ${resetToken}`);
      console.log("=========================================");

      return res.status(200).json({
        success: true,
        message: "Reset OTP sent to console (development mode)",
        token: resetToken, // expose token in dev mode for easy manual/API testing
      });
    }

    // ---- Send real email ----
    try {
      const transport = nodemailer.createTransport({
        host,
        port,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transport.sendMail({
        from: fromEmail,
        to: email,
        subject: 'Your Password Reset OTP',
        text: emailBody,
      });
    } catch (mailErr) {
      console.error('Error sending reset OTP email:', mailErr);
      return res.status(500).json({
        success: false,
        message: 'Failed to send reset email. Please try again later.',
      });
    }

    res.status(200).json({
      success: true,
      message: "Reset OTP sent to email",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Controller to handle password reset.
 */
exports.resetPassword = async (req, res) => {
  try {
    const token = req.body.token || req.params.token;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required',
      });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password Reset Successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Controller to handle user logout.
 */
exports.logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
