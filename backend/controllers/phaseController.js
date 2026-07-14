const phaseService = require('../services/phaseService');
const catchAsync = require('../utils/catchAsync');

/**
 * Phase Controller
 * Handles HTTP requests and delegates to the service layer.
 */

// POST /api/phases
exports.createPhase = catchAsync(async (req, res, next) => {
  const phase = await phaseService.createPhase(req.body);

  res.status(201).json({
    success: true,
    message: 'Phase created successfully',
    data: phase,
  });
});

// GET /api/phases
exports.getAllPhases = catchAsync(async (req, res, next) => {
  const phases = await phaseService.getAllPhases();

  res.status(200).json({
    success: true,
    message: 'Phases retrieved successfully',
    data: phases,
  });
});

// GET /api/phases/:id
exports.getPhaseById = catchAsync(async (req, res, next) => {
  const phase = await phaseService.getPhaseById(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Phase retrieved successfully',
    data: phase,
  });
});

// PUT /api/phases/:id
exports.updatePhase = catchAsync(async (req, res, next) => {
  const phase = await phaseService.updatePhase(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Phase updated successfully',
    data: phase,
  });
});

// DELETE /api/phases/:id
exports.deletePhase = catchAsync(async (req, res, next) => {
  await phaseService.deletePhase(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Phase deleted successfully',
    data: null,
  });
});
