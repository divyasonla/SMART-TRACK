const express = require('express');
const mongoose = require('mongoose');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

// ──────────────────────────────────────────────
// 1. MOUNTED MODEL DEFINITION
// ──────────────────────────────────────────────

/**
 * Why 'date' is duplicated at both document level and item level:
 * 
 * 1. Document level 'date': Standardizes the document boundary (one document per student per day). 
 *    Enables efficient unique indexing on { studentId, date } and fast document-level lookups.
 * 2. Item level 'date': Provides redundant storage at the subdocument level. This allows easier 
 *    querying, filtering, and aggregation (e.g., via MongoDB $unwind or direct subdocument filters) 
 *    later on without needing to reference the parent document's fields in complex pipeline stages.
 */
const DailyRecordSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'studentId is required.'],
    },
    date: {
      type: Date,
      required: [true, 'date is required.'],
    },
    goals: [
      {
        goalId: String,
        description: String,
        date: Date, // Redundant copy of top-level date
      },
    ],
    reflections: [
      {
        goalId: String,
        assessment: {
          type: String,
          enum: ['sufficient', 'insufficient'],
        },
        reflectionText: String,
        date: Date, // Redundant copy of top-level date
      },
    ],
    revisions: [
      {
        topic: String,
        sourceGoalId: String,
        reason: String,
        date: Date, // Redundant copy of top-level date
      },
    ],
  },
  {
    timestamps: true,
  }
);

// One record per student per day
DailyRecordSchema.index({ studentId: 1, date: 1 }, { unique: true });

// Check if model already exists to avoid compiling issues during reloads
const DailyRecord = mongoose.models.DailyRecord || mongoose.model('DailyRecord', DailyRecordSchema);

// ──────────────────────────────────────────────
// 2. DATE NORMALIZATION HELPERS
// ──────────────────────────────────────────────

/**
 * Normalize a date string (YYYY-MM-DD) to midnight UTC.
 */
const normalizeDateToUTC = (dateStr) => {
  const parts = dateStr.split('-');
  if (parts.length !== 3) {
    throw new AppError('Invalid date format. Use YYYY-MM-DD.', 400);
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    throw new AppError('Invalid date values. Use YYYY-MM-DD.', 400);
  }

  const d = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));

  if (isNaN(d.getTime())) {
    throw new AppError('Invalid date. Use YYYY-MM-DD.', 400);
  }

  return d;
};

/**
 * Build the end-of-day boundary for a given date string (23:59:59.999 UTC).
 */
const endOfDayUTC = (dateStr) => {
  const d = normalizeDateToUTC(dateStr);
  d.setUTCHours(23, 59, 59, 999);
  return d;
};

// ──────────────────────────────────────────────
// 3. API ENDPOINTS
// ──────────────────────────────────────────────

/**
 * POST /
 * Create or update (upsert) a DailyRecord.
 * Accepts { studentId, date, goals, reflections, revisions } in the body.
 * 
 * How the per-item duplicate prevention works:
 * 
 * 1. Prior to running findOneAndUpdate, we query the DB to check if a DailyRecord exists 
 *    for this student on this normalized date.
 * 2. If the document exists, we extract arrays of existing goals, reflections, and revisions.
 * 3. We filter out any incoming items that match our duplicate criteria:
 *    - Goals / Reflections: matching 'goalId' and the target date.
 *    - Revisions: matching 'topic' + 'sourceGoalId' and the target date.
 * 4. We map over the non-duplicate items and automatically attach the nested 'date' property.
 * 5. Finally, we execute the update using MongoDB's $push with $each on a single findOneAndUpdate call. 
 *    If an array is omitted from the request payload, it is completely ignored to preserve existing data.
 */
router.post(
  '/',
  catchAsync(async (req, res, next) => {
    const { studentId, date } = req.body;

    // Validate required fields
    if (!studentId) {
      return next(new AppError('studentId is required.', 400));
    }
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return next(new AppError('Invalid studentId format.', 400));
    }
    if (!date) {
      return next(new AppError('date is required (YYYY-MM-DD).', 400));
    }

    // Normalize date to midnight UTC
    const normalizedDate = normalizeDateToUTC(date);

    // Fetch existing document to check for duplicate sub-items
    const existingRecord = await DailyRecord.findOne({ studentId, date: normalizedDate });

    const update = {};
    const pushObj = {};

    // 1. Process Goals
    if ('goals' in req.body && Array.isArray(req.body.goals)) {
      const existingGoals = existingRecord ? existingRecord.goals : [];
      const filteredGoals = req.body.goals
        .filter(incomingGoal => {
          // Skip if goal with same goalId and date already exists
          const isDuplicate = existingGoals.some(
            g => g.goalId === incomingGoal.goalId && 
                 (!g.date || g.date.getTime() === normalizedDate.getTime())
          );
          return !isDuplicate;
        })
        .map(g => ({ ...g, date: normalizedDate }));

      if (filteredGoals.length > 0) {
        pushObj.goals = { $each: filteredGoals };
      }
    }

    // 2. Process Reflections
    if ('reflections' in req.body && Array.isArray(req.body.reflections)) {
      const existingReflections = existingRecord ? existingRecord.reflections : [];
      const filteredReflections = req.body.reflections
        .filter(incomingRefl => {
          // Skip if reflection with same goalId and date already exists
          const isDuplicate = existingReflections.some(
            r => r.goalId === incomingRefl.goalId && 
                 (!r.date || r.date.getTime() === normalizedDate.getTime())
          );
          return !isDuplicate;
        })
        .map(r => ({ ...r, date: normalizedDate }));

      if (filteredReflections.length > 0) {
        pushObj.reflections = { $each: filteredReflections };
      }
    }

    // 3. Process Revisions
    if ('revisions' in req.body && Array.isArray(req.body.revisions)) {
      const existingRevisions = existingRecord ? existingRecord.revisions : [];
      const filteredRevisions = req.body.revisions
        .filter(incomingRev => {
          // Skip if revision with same topic, sourceGoalId, and date already exists
          const isDuplicate = existingRevisions.some(
            rev => rev.topic === incomingRev.topic && 
                   rev.sourceGoalId === incomingRev.sourceGoalId && 
                   (!rev.date || rev.date.getTime() === normalizedDate.getTime())
          );
          return !isDuplicate;
        })
        .map(rev => ({ ...rev, date: normalizedDate }));

      if (filteredRevisions.length > 0) {
        pushObj.revisions = { $each: filteredRevisions };
      }
    }

    // Apply push operator only if there are new items to append
    if (Object.keys(pushObj).length > 0) {
      update.$push = pushObj;
    }

    // Set key identifiers on insert
    update.$setOnInsert = {
      studentId,
      date: normalizedDate,
    };

    const record = await DailyRecord.findOneAndUpdate(
      { studentId, date: normalizedDate },
      update,
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    // Determine status code based on whether document was newly created
    const isNew = record.createdAt.getTime() === record.updatedAt.getTime();

    res.status(isNew ? 201 : 200).json({
      success: true,
      message: isNew
        ? 'Daily record created successfully.'
        : 'Daily record updated successfully.',
      data: record,
    });
  })
);

/**
 * GET /
 * Retrieve DailyRecords matching the filters.
 * Supports: studentId, date, startDate, endDate
 */
router.get(
  '/',
  catchAsync(async (req, res, next) => {
    const { studentId, date, startDate, endDate } = req.query;

    const filter = {};

    // Filter by student if provided
    if (studentId) {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return next(new AppError('Invalid studentId format.', 400));
      }
      filter.studentId = studentId;
    }

    // Filter by date or date range
    if (date) {
      const dayStart = normalizeDateToUTC(date);
      const dayEnd = endOfDayUTC(date);
      filter.date = { $gte: dayStart, $lte: dayEnd };
    } else if (startDate && endDate) {
      const rangeStart = normalizeDateToUTC(startDate);
      const rangeEnd = endOfDayUTC(endDate);

      if (rangeStart > rangeEnd) {
        return next(
          new AppError('startDate must be before or equal to endDate.', 400)
        );
      }

      filter.date = { $gte: rangeStart, $lte: rangeEnd };
    } else if (startDate) {
      filter.date = { $gte: normalizeDateToUTC(startDate) };
    } else if (endDate) {
      filter.date = { $lte: endOfDayUTC(endDate) };
    }

    // Retrieve documents and populate student information
    const records = await DailyRecord.find(filter)
      .populate('studentId', 'fullName email campus batch')
      .sort({ date: -1 })
      .lean();

    res.status(200).json({
      success: true,
      message: 'Daily records retrieved successfully.',
      count: records.length,
      data: records,
    });
  })
);

module.exports = router;
