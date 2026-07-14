const express = require('express');
const goalController = require('../controllers/goalController');

const router = express.Router();

// Route group for /api/goals
router
  .route('/')
  .get(goalController.getAllGoals)
  .post(goalController.createGoal);

// Route group for /api/goals/:id
router
  .route('/:id')
  .get(goalController.getGoalById)
  .put(goalController.updateGoal)
  .delete(goalController.deleteGoal);

module.exports = router;
