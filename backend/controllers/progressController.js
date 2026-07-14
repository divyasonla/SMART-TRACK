const progressService = require('../services/progressService');
const catchAsync = require('../utils/catchAsync');

/**
 * Progress Controller
 * Handles HTTP requests and delegates to the service layer.
 */

// POST /api/progress
exports.createProgress = catchAsync(async (req, res, next) => {
  const progress = await progressService.createProgress(req.body);

  res.status(201).json({
    success: true,
    message: 'Progress created successfully',
    data: progress,
  });
});

// GET /api/progress
exports.getAllProgress = catchAsync(async (req, res, next) => {
  const progress = await progressService.getAllProgress();

  res.status(200).json({
    success: true,
    message: 'Progress records retrieved successfully',
    data: progress,
  });
});

// GET /api/progress/:id
exports.getProgressById = catchAsync(async (req, res, next) => {
  const progress = await progressService.getProgressById(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Progress retrieved successfully',
    data: progress,
  });
});

// PUT /api/progress/:id
exports.updateProgress = catchAsync(async (req, res, next) => {
  const progress = await progressService.updateProgress(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Progress updated successfully',
    data: progress,
  });
});

// DELETE /api/progress/:id
exports.deleteProgress = catchAsync(async (req, res, next) => {
  await progressService.deleteProgress(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Progress deleted successfully',
    data: null,
  });
});
