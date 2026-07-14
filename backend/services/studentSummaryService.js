const mongoose = require('mongoose');
const Goal = require('../models/Goal');
const Progress = require('../models/Progress');
const Reflection = require('../models/Reflection');
const { Student } = require('../models/Student');
const AppError = require('../utils/AppError');

/**
 * Validate if a string is a valid MongoDB ObjectId
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Helper to get UTC date and time components.
 */
const getUTCDateTimeStrings = (d = new Date()) => {
  const pad = (num) => String(num).padStart(2, '0');
  const dateStr = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
  const timeStr = `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
  return { date: dateStr, time: timeStr };
};

/**
 * Parse YYYY-MM-DD string to start and end of day Date objects (UTC time).
 */
const parseDateToRange = (dateStr) => {
  const parts = dateStr.split('-');
  if (parts.length !== 3) {
    throw new AppError('Invalid date format. Use YYYY-MM-DD', 400);
  }
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    throw new AppError('Invalid date values. Use YYYY-MM-DD', 400);
  }

  // Create start and end of the day in UTC
  const start = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new AppError('Invalid date. Use YYYY-MM-DD', 400);
  }

  return { start, end };
};

exports.getDailySummary = async (studentId, startDateStr, endDateStr, dateStr) => {
  // Validate studentId
  if (!isValidObjectId(studentId)) {
    throw new AppError('Invalid student ID format', 400);
  }
  const studentObjectId = new mongoose.Types.ObjectId(studentId);

  let start, end;
  let responseDateStr;

  if (dateStr) {
    // Single date filter
    const range = parseDateToRange(dateStr);
    start = range.start;
    end = range.end;
    responseDateStr = dateStr;
  } else if (startDateStr && endDateStr) {
    // Date range filter
    const startRange = parseDateToRange(startDateStr);
    const endRange = parseDateToRange(endDateStr);
    start = startRange.start;
    end = endRange.end;
    responseDateStr = endDateStr;
  } else {
    // Default to today in UTC
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();
    const day = now.getUTCDate();

    start = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
    const pad = (num) => String(num).padStart(2, '0');
    responseDateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
    end = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
  }

  if (start > end) {
    throw new AppError('startDate must be less than or equal to endDate', 400);
  }

  // Query database using createdAt index / timestamp filter
  const [goals, progress, reflections] = await Promise.all([
    Goal.find({
      studentId: studentObjectId,
      createdAt: { $gte: start, $lte: end },
    })
      .populate('phaseId', 'title phaseNumber')
      .sort({ createdAt: 1 })
      .lean(),
    Progress.find({
      studentId: studentObjectId,
      createdAt: { $gte: start, $lte: end },
    })
      .sort({ createdAt: 1 })
      .lean(),
    Reflection.find({
      studentId: studentObjectId,
      createdAt: { $gte: start, $lte: end },
    })
      .sort({ createdAt: 1 })
      .lean(),
  ]);

  const { time: currentTimeStr } = getUTCDateTimeStrings(new Date());

  const result = {
    date: responseDateStr,
    time: currentTimeStr,
    studentId: studentId,
    goals,
    reflections,
    progress,
  };

  if (startDateStr && endDateStr) {
    result.startDate = startDateStr;
    result.endDate = endDateStr;
  }

  return result;
};

/**
 * Get daily summary by student EMAIL instead of ObjectId.
 * Looks up the Student document by email, then delegates to getDailySummary.
 *
 * GET /api/students/summary?email=user@example.com&startDate=...&endDate=...
 */
exports.getDailySummaryByEmail = async (email, startDateStr, endDateStr, dateStr) => {
  if (!email || typeof email !== 'string') {
    throw new AppError('A valid email address is required.', 400);
  }

  // Find the student by email (case-insensitive)
  const student = await Student.findOne({ email: email.trim().toLowerCase() }).lean();
  if (!student) {
    throw new AppError(`No student found with email: ${email}`, 404);
  }

  // Reuse existing logic with the resolved ObjectId
  return exports.getDailySummary(
    student._id.toString(),
    startDateStr,
    endDateStr,
    dateStr
  );
};
