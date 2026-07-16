const studentSummaryService = require('../services/studentSummaryService');
const catchAsync = require('../utils/catchAsync');

/**
 * Get daily summary (goals, progress, reflections) for a student within a date range or specific date
 * GET /api/students/:studentId/daily-summary
 */
exports.getDailySummary = catchAsync(async (req, res, next) => {
  const { studentId } = req.params;
  const { startDate, endDate, date } = req.query;

  // Fetch summary from service
  const summary = await studentSummaryService.getDailySummary(studentId, startDate, endDate, date);

  // Return clean JSON response directly as specified in requirements
  res.status(200).json(summary);
});

/**
 * Get daily summary by student EMAIL (no ObjectId needed)
 * GET /api/students/summary?email=user@example.com&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
exports.getDailySummaryByEmail = catchAsync(async (req, res, next) => {
  const { email, startDate, endDate, date } = req.query;

  const summary = await studentSummaryService.getDailySummaryByEmail(email, startDate, endDate, date);

  res.status(200).json(summary);
});
