const reflectionService = require('../services/reflectionService');
const catchAsync = require('../utils/catchAsync');

/**
 * Reflection Controller
 * Handles HTTP requests and delegates to the service layer.
 */

// POST /api/reflections
exports.createReflection = catchAsync(async (req, res, next) => {
  const reflection = await reflectionService.createReflection(req.body);

  res.status(201).json({
    success: true,
    message: 'Reflection created successfully',
    data: reflection,
  });
});

// GET /api/reflections
exports.getAllReflections = catchAsync(async (req, res, next) => {
  const reflections = await reflectionService.getAllReflections();

  res.status(200).json({
    success: true,
    message: 'Reflections retrieved successfully',
    data: reflections,
  });
});

// GET /api/reflections/:id
exports.getReflectionById = catchAsync(async (req, res, next) => {
  const reflection = await reflectionService.getReflectionById(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Reflection retrieved successfully',
    data: reflection,
  });
});

// PUT /api/reflections/:id
exports.updateReflection = catchAsync(async (req, res, next) => {
  const reflection = await reflectionService.updateReflection(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Reflection updated successfully',
    data: reflection,
  });
});

// DELETE /api/reflections/:id
exports.deleteReflection = catchAsync(async (req, res, next) => {
  await reflectionService.deleteReflection(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Reflection deleted successfully',
    data: null,
  });
});
