const express = require('express');
const userProgressController = require('../controllers/userProgressController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Enforce JWT authentication for all phase progress endpoints
router.use(protect);

/**
 * Route: GET /api/v1/phases
 * Purpose: Fetch all phases and details, including completion and lock status
 */
router.get('/', userProgressController.getPhases);

/**
 * Route: POST /api/v1/phases/complete
 * Purpose: Complete current active phase and unlock the next phase sequentially
 */
router.post('/complete', userProgressController.completePhase);

/**
 * Route: GET /api/v1/phases/active
 * Purpose: Fetch metadata of current active phase
 */
router.get('/active', userProgressController.getActivePhase);

module.exports = router;
