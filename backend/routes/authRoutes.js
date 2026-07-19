const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// User Signup / Register
router.post("/signup", authController.signup);
router.post("/register", authController.signup);

// User Login
router.post("/login", authController.login);

// Forgot Password, Verify OTP, Reset Password
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOtp);
router.post("/reset-password", authController.resetPassword);
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.post("/reset-password", authController.resetPassword);

// Protected routes
router.get("/profile", protect, authController.getProfile);
router.post("/logout", protect, authController.logout);

module.exports = router;