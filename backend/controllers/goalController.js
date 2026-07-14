const goalService = require('../services/goalService');
const catchAsync = require('../utils/catchAsync');

/**
 * Controller to handle goal creation.
 * Responds with 201 Created and the created Goal document.
 */
const createGoal = catchAsync(async (req, res, next) => {
  // Extract parameters to prevent body injection
  const {
    title,
    description,
    expectedCompletionTime,
    deadline,
    priority,
    status,
  } = req.body;

  const goal = await goalService.createGoal(req.user.id, {
    title,
    description,
    expectedCompletionTime: Number(expectedCompletionTime),
    deadline,
    priority,
    status,
  });

  res.status(201).json({
    status: 'success',
    message: 'Goal created successfully',
    data: {
      goal,
    },
  });
});

/**
 * Controller to fetch all goals for the logged-in user.
 * Responds with 200 OK and an array of goals.
 */
const getMyGoals = catchAsync(async (req, res, next) => {
  const goals = await goalService.getUserGoals(req.user.id);

  res.status(200).json({
    status: 'success',
    results: goals.length,
    data: {
      goals,
    },
  });
});

/**
 * Controller to fetch a specific goal.
 * Responds with 200 OK and the Goal document.
 */
const getGoal = catchAsync(async (req, res, next) => {
  const goal = await goalService.getGoal(req.params.id, req.user.id);

  res.status(200).json({
    status: 'success',
    data: {
      goal,
    },
  });
});

/**
 * Controller to update a specific goal.
 * Responds with 200 OK and the updated Goal document.
 */
const updateGoal = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    expectedCompletionTime,
    deadline,
    priority,
    status,
  } = req.body;

  const updatedGoal = await goalService.updateGoal(req.params.id, req.user.id, {
    title,
    description,
    expectedCompletionTime: expectedCompletionTime ? Number(expectedCompletionTime) : undefined,
    deadline,
    priority,
    status,
  });

  res.status(200).json({
    status: 'success',
    message: 'Goal updated successfully',
    data: {
      goal: updatedGoal,
    },
  });
});

/**
 * Controller to delete a specific goal.
 * Responds with 200 OK.
 */
const deleteGoal = catchAsync(async (req, res, next) => {
  await goalService.deleteGoal(req.params.id, req.user.id);

  res.status(200).json({
    status: 'success',
    message: 'Goal deleted successfully',
  });
});

module.exports = {
  createGoal,
  getMyGoals,
  getGoal,
  updateGoal,
  deleteGoal,
};
