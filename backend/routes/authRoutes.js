const express = require('express');
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes for user registration and authentication
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

// Protected routes (require valid JWT)
router.get('/me', protect, authController.getProfile);

// Admin-only test route
router.get('/admin-test', protect, restrictTo('Admin'), authController.adminTest);

module.exports = router;
