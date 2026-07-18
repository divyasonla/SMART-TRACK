const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const validator = require('validator');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const { MailtrapTransport } = require('mailtrap');
// Helper to generate JWT
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'defaultsecret';
  return jwt.sign({ id }, secret, { expiresIn: '1d' });
};
const bcrypt = require("bcryptjs");
/**
 * Controller to handle user registration.
 * Responds with 201 Created and the user document + token.
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, campus, gender } = req.body;

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

    const user = await User.create({
      name,
      email,
      password,
      campus,
      gender,
    });

    // Generate JWT token for the newly registered user
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      data: user,
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
 * Controller to handle user login.
 * Responds with 200 OK and the user document + token.
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

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

    res.status(200).json({
      success: true,
      message: "Login Successful",
      data: user,
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
 * Controller to get the profile of the currently logged-in user.
 */
exports.forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;

      if (!validator.isEmail(email)) {
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

      // Generate a 6‑digit OTP (or keep the hex token as OTP)
      const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

      await user.save({ validateBeforeSave: false });

      // ---- Mailtrap/SMTP OTP email sending ----
      try {
        const host = process.env.SMTP_HOST;
        const port = Number(process.env.SMTP_PORT) || 587;
        const fromEmail = process.env.SMTP_FROM || "divyasonla@navgurukul.org";
        const emailBody = `Your OTP for resetting your password is: ${resetToken}. It will expire in 15 minutes.`;

        const transport = nodemailer.createTransport({
          host,
          port,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

        console.log("=========================================");
        console.log("🚀 SENDING PASSWORD RESET EMAIL:");
        console.log(`📡 SMTP Host: ${host}:${port}`);
        console.log(`✉️ From:      ${fromEmail}`);
        console.log(`✉️ To:        ${email}`);
        console.log(`📝 Subject:   Your Password Reset OTP`);
        console.log(`💬 Message:   ${emailBody}`);
        console.log("=========================================");

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
 * Controller to test Admin-only access.
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