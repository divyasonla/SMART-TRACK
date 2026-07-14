const express = require('express');
const studentSummaryController = require('../controllers/studentSummaryController');

const router = express.Router();

// GET /api/students/summary?email=user@example.com&startDate=...&endDate=...
// ⚠️  Must be declared BEFORE /:studentId/daily-summary to prevent "summary"
//     being captured as a studentId parameter.
router.get('/summary', studentSummaryController.getDailySummaryByEmail);

// GET /api/students/:studentId/daily-summary  (original route — unchanged)
router.get('/:studentId/daily-summary', studentSummaryController.getDailySummary);

module.exports = router;
