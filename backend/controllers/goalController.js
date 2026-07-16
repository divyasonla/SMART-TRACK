const goalService = require('../services/goalService');
const catchAsync = require('../utils/catchAsync');

/**
 * Goal Controller
 * Handles HTTP requests and delegates to the service layer.
 */

// POST /api/goals
// exports.createGoal = catchAsync(async (req, res, next) => {
//   const goal = await goalService.createGoal(req.body);

//   res.status(201).json({
//     success: true,
//     message: 'Goal created successfully',
//     data: goal,
//   });
// });

// GET /api/goals
exports.getAllGoals = catchAsync(async (req, res, next) => {
  const goals = await goalService.getAllGoals();

  res.status(200).json({
    success: true,
    message: 'Goals retrieved successfully',
    data: goals,
  });
});

// GET /api/goals/:id
exports.getGoalById = catchAsync(async (req, res, next) => {
  const goal = await goalService.getGoalById(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Goal retrieved successfully',
    data: goal,
  });
});

// PUT /api/goals/:id
exports.updateGoal = catchAsync(async (req, res, next) => {
  const goal = await goalService.updateGoal(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Goal updated successfully',
    data: goal,
  });
});

// DELETE /api/goals/:id
exports.deleteGoal = catchAsync(async (req, res, next) => {
  await goalService.deleteGoal(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Goal deleted successfully',
    data: null,
  });
});


exports.createGoal = catchAsync(async (req, res, next) => {
  console.log('REQUEST BODY:', req.body); // temporary debug line
  const goal = await goalService.createGoal(req.body);
  res.status(201).json({
    success: true,
    message: 'Goal created successfully',
    data: goal,
  });
});
