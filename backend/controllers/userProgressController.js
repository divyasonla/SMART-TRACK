const userProgressService = require('../services/userProgressService');
const catchAsync = require('../utils/catchAsync');

/**
 * GET /api/v1/phases
 * Get all phases mapping metadata from phasedata.json with unlock & completion status.
 */
const getPhases = catchAsync(async (req, res, next) => {
  // Use the authenticated user's ID attached by the protect middleware
  const phases = await userProgressService.getPhasesWithStatus(req.user.id);
  
  res.status(200).json({
    status: 'success',
    data: {
      phases,
    },
  });
});

/**
 * POST /api/v1/phases/complete
 * Mark a phase as completed, automatically unlocking the next phase.
 * Request body: { "phase": 2 }
 */
const completePhase = catchAsync(async (req, res, next) => {
  const { phase } = req.body;

  if (!phase) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide the phase number in the request body.',
    });
  }

  const progress = await userProgressService.completePhase(req.user.id, Number(phase));

  res.status(200).json({
    status: 'success',
    message: `Phase ${phase} marked as completed. Next phase has been automatically unlocked.`,
    data: {
      progress,
    },
  });
});

/**
 * GET /api/v1/phases/active
 * Get the currently active (unlocked but not completed) phase metadata.
 */
const getActivePhase = catchAsync(async (req, res, next) => {
  const activePhase = await userProgressService.getCurrentActivePhase(req.user.id);

  res.status(200).json({
    status: 'success',
    data: {
      activePhase,
    },
  });
});

module.exports = {
  getPhases,
  completePhase,
  getActivePhase,
};
