const express = require('express');
const mongoose = require('mongoose');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { Student } = require('../models/Student');

const router = express.Router();

// ──────────────────────────────────────────────
// 1. MOUNTED MODEL DEFINITION
// ──────────────────────────────────────────────

/**
 * Why 'date' is duplicated at both document level and item level:
 * 
 * 1. Document level 'date': Standardizes the document boundary (one document per student per day). 
 *    Enables efficient unique indexing on { email, date } and fast lookups.
 * 2. Item level 'date': Provides redundant storage at the subdocument level. This allows easier 
 *    querying, filtering, and aggregation (e.g., via MongoDB $unwind) later.
 */
const DailyRecordSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: false, // studentId is now optional
    },
    email: {
      type: String,
      required: [true, 'Student email is required.'],
      trim: true,
      lowercase: true,
    },
    date: {
      type: Date,
      required: [true, 'date is required.'],
    },
    goals: [
      {
        goalId: String,
        description: String,
        date: Date,
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
        date: Date,
      },
    ],
    revisions: [
      {
        topic: String,
        sourceGoalId: String,
        reason: String,
        date: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// One record per student email per day
DailyRecordSchema.index({ email: 1, date: 1 }, { unique: true });

// Check if model already exists to avoid compiling issues during reloads
const DailyRecord = mongoose.models.DailyRecord || mongoose.model('DailyRecord', DailyRecordSchema);

// Programmatically drop the old unique index on studentId to prevent conflicts on production databases
DailyRecord.collection.dropIndex('studentId_1_date_1').catch(() => {
  // Ignore error if index doesn't exist
});

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
 * Accepts { studentId, email, date, goals, reflections, revisions } in the body.
 */
router.post(
  '/',
  catchAsync(async (req, res, next) => {
    let { studentId, email, date } = req.body;

    // Validate date presence
    if (!date) {
      return next(new AppError('date is required (YYYY-MM-DD).', 400));
    }

    // Require at least email or studentId to identify the student
    if (!email && !studentId) {
      return next(new AppError('Either studentId or email is required.', 400));
    }

    // Try to resolve studentId if only email is provided (non-blocking lookup)
    if (email && !studentId) {
      email = email.toLowerCase().trim();
      const student = await Student.findOne({ email });
      if (student) {
        studentId = student._id;
      }
    }

    // Resolve email if studentId is provided
    if (studentId && !email) {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return next(new AppError('Invalid studentId format.', 400));
      }
      const student = await Student.findById(studentId);
      if (student) {
        email = student.email;
      } else {
        return next(new AppError('Student with the provided ID does not exist.', 404));
      }
    }

    // Final validation of email existence
    if (!email) {
      return next(new AppError('Could not resolve student email.', 400));
    }

    email = email.toLowerCase().trim();
    // Normalize date to midnight UTC
    const normalizedDate = normalizeDateToUTC(date);

    // Fetch existing document to check for duplicate sub-items by email & date
    const existingRecord = await DailyRecord.findOne({ email, date: normalizedDate });

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

    // Update the email and conditionally set studentId if resolved
    update.$set = {
      email,
    };
    if (studentId) {
      update.$set.studentId = studentId;
    }

    // Set key identifiers on insert
    update.$setOnInsert = {
      date: normalizedDate,
    };

    const record = await DailyRecord.findOneAndUpdate(
      { email, date: normalizedDate },
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
 * Supports: studentId, email, date, startDate, endDate
 */
router.get(
  '/',
  catchAsync(async (req, res, next) => {
    const { studentId, email, date, startDate, endDate } = req.query;

    const filter = {};

    // Filter by studentId if provided
    if (studentId) {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return next(new AppError('Invalid studentId format.', 400));
      }
      filter.studentId = studentId;
    }

    // Filter by email if provided
    if (email) {
      filter.email = email.toLowerCase().trim();
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
