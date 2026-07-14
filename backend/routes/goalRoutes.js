const express = require('express');
const goalController = require('../controllers/goalController');
const { validateGoal } = require('../middleware/validationMiddleware');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Enforce authentication for all goal-related requests
router.use(protect);

// Root path routes: /api/v1/goals
router
  .route('/')
  .get(goalController.getMyGoals)
  .post(validateGoal, goalController.createGoal);

// Parameterized path routes: /api/v1/goals/:id
router
  .route('/:id')
  .get(goalController.getGoal)
  .patch(validateGoal, goalController.updateGoal)
  .delete(goalController.deleteGoal);

module.exports = router;
