const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// ──────────────────────────────────────────────
// 1. SCHEMA AND MODEL DEFINITION
// ──────────────────────────────────────────────

const DailyRecordSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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

const normalizeDateToUTC = (dateInput) => {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return null;
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0));
};

const endOfDayUTC = (dateInput) => {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return null;
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999));
};

// ──────────────────────────────────────────────
// 3. ROUTER INITIALIZATION
// ──────────────────────────────────────────────

const router = express.Router();

// ──────────────────────────────────────────────
// 4. POST / (UPSERT DAILY RECORD)
// ──────────────────────────────────────────────
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
      const student = await User.findOne({ email });
      if (student) {
        studentId = student._id;
      }
    }

    // Resolve email if studentId is provided
    if (studentId && !email) {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return next(new AppError('Invalid studentId format.', 400));
      }
      const student = await User.findById(studentId);
      if (student) {
        email = student.email;
      } else {
        return next(new AppError('User with the provided ID does not exist.', 404));
      }
    }

    // Final validation of email existence
    if (!email) {
      return next(new AppError('Could not resolve student email.', 400));
    }

    email = email.toLowerCase().trim();
    const normalizedDate = normalizeDateToUTC(date);

    // Fetch existing document to check for duplicate sub-items by email & date
    const existingRecord = await DailyRecord.findOne({ email, date: normalizedDate });

    const update = {};
    const pushObj = {};

    // 1. Process Goals
    if ('goals' in req.body && Array.isArray(req.body.goals)) {
      const existingGoals = existingRecord ? existingRecord.goals : [];
      const filteredGoals = req.body.goals
        .map(g => ({
          ...g,
          goalId: g.goalId || new mongoose.Types.ObjectId().toString(),
          date: normalizedDate
        }))
        .filter(incomingGoal => {
          // Skip if goal with same goalId and date already exists
          const isDuplicate = existingGoals.some(
            g => g.goalId === incomingGoal.goalId && 
                 (!g.date || g.date.getTime() === normalizedDate.getTime())
          );
          return !isDuplicate;
        });

      if (filteredGoals.length > 0) {
        pushObj.goals = { $each: filteredGoals };
      }
    }

    // 2. Process Reflections
    if ('reflections' in req.body && Array.isArray(req.body.reflections)) {
      const existingReflections = existingRecord ? existingRecord.reflections : [];
      const filteredReflections = req.body.reflections
        .map(r => ({
          ...r,
          goalId: r.goalId || new mongoose.Types.ObjectId().toString(),
          date: normalizedDate
        }))
        .filter(incomingRefl => {
          // Skip if reflection with same goalId and date already exists
          const isDuplicate = existingReflections.some(
            r => r.goalId === incomingRefl.goalId && 
                 (!r.date || r.date.getTime() === normalizedDate.getTime())
          );
          return !isDuplicate;
        });

      if (filteredReflections.length > 0) {
        pushObj.reflections = { $each: filteredReflections };
      }
    }

    // 3. Process Revisions
    if ('revisions' in req.body && Array.isArray(req.body.revisions)) {
      const existingRevisions = existingRecord ? existingRecord.revisions : [];
      const filteredRevisions = req.body.revisions
        .map(rev => ({
          ...rev,
          sourceGoalId: rev.sourceGoalId || new mongoose.Types.ObjectId().toString(),
          date: normalizedDate
        }))
        .filter(incomingRev => {
          // Skip if revision with same topic, sourceGoalId, and date already exists
          const isDuplicate = existingRevisions.some(
            rev => rev.topic === incomingRev.topic && 
                   rev.sourceGoalId === incomingRev.sourceGoalId && 
                   (!rev.date || rev.date.getTime() === normalizedDate.getTime())
          );
          return !isDuplicate;
        });

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

// ──────────────────────────────────────────────
// 5. GET / (RETRIEVE DAILY RECORD(S))
// ──────────────────────────────────────────────
router.get(
  '/',
  catchAsync(async (req, res, next) => {
    const { studentId, email, date, startDate, endDate } = req.query;

    const filter = {};

    if (studentId) {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return next(new AppError('Invalid studentId format.', 400));
      }
      filter.studentId = studentId;
    }

    if (email) {
      filter.email = email.toLowerCase().trim();
    }

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

    const records = await DailyRecord.find(filter)
      .populate('studentId', 'name email campus')
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

// ──────────────────────────────────────────────
// 6. PUT ROUTES (FULL ITEM REPLACEMENT)
// ──────────────────────────────────────────────

/**
 * PUT /goal
 * Replace description of a single goal.
 */
router.put(
  '/goal',
  catchAsync(async (req, res, next) => {
    let { email, date, goalId, description } = req.body;

    if (!email || !date) {
      return next(new AppError('email and date are required.', 400));
    }
    if (!goalId) {
      return next(new AppError('goalId is required.', 400));
    }

    email = email.toLowerCase().trim();
    const normalizedDate = normalizeDateToUTC(date);

    const record = await DailyRecord.findOneAndUpdate(
      { email, date: normalizedDate, "goals.goalId": goalId },
      { $set: { "goals.$[elem].description": description } },
      {
        arrayFilters: [{ "elem.goalId": goalId }],
        new: true,
        runValidators: true,
      }
    );

    if (!record) {
      return next(new AppError('DailyRecord or matching goal item not found.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Goal updated successfully.',
      data: record,
    });
  })
);

/**
 * PUT /reflection
 * Replace fields of a single reflection.
 */
router.put(
  '/reflection',
  catchAsync(async (req, res, next) => {
    let { email, date, goalId, assessment, reflectionText } = req.body;

    if (!email || !date) {
      return next(new AppError('email and date are required.', 400));
    }
    if (!goalId) {
      return next(new AppError('goalId is required.', 400));
    }

    email = email.toLowerCase().trim();
    const normalizedDate = normalizeDateToUTC(date);

    const record = await DailyRecord.findOneAndUpdate(
      { email, date: normalizedDate, "reflections.goalId": goalId },
      { 
        $set: { 
          "reflections.$[elem].assessment": assessment,
          "reflections.$[elem].reflectionText": reflectionText
        } 
      },
      {
        arrayFilters: [{ "elem.goalId": goalId }],
        new: true,
        runValidators: true,
      }
    );

    if (!record) {
      return next(new AppError('DailyRecord or matching reflection item not found.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Reflection updated successfully.',
      data: record,
    });
  })
);

/**
 * PUT /revision
 * Replace fields of a single revision.
 */
router.put(
  '/revision',
  catchAsync(async (req, res, next) => {
    let { email, date, topic, sourceGoalId, reason } = req.body;

    if (!email || !date) {
      return next(new AppError('email and date are required.', 400));
    }
    if (!topic || !sourceGoalId) {
      return next(new AppError('topic and sourceGoalId are required.', 400));
    }

    email = email.toLowerCase().trim();
    const normalizedDate = normalizeDateToUTC(date);

    const record = await DailyRecord.findOneAndUpdate(
      { 
        email, 
        date: normalizedDate, 
        "revisions.topic": topic,
        "revisions.sourceGoalId": sourceGoalId
      },
      { 
        $set: { 
          "revisions.$[elem].reason": reason
        } 
      },
      {
        arrayFilters: [{ "elem.topic": topic, "elem.sourceGoalId": sourceGoalId }],
        new: true,
        runValidators: true,
      }
    );

    if (!record) {
      return next(new AppError('DailyRecord or matching revision item not found.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Revision updated successfully.',
      data: record,
    });
  })
);

// ──────────────────────────────────────────────
// 7. PATCH ROUTES (PARTIAL ITEM UPDATES)
// ──────────────────────────────────────────────

/**
 * PATCH /goal
 * Partially update a single goal's fields.
 */
router.patch(
  '/goal',
  catchAsync(async (req, res, next) => {
    let { email, date, goalId, description } = req.body;

    if (!email || !date) {
      return next(new AppError('email and date are required.', 400));
    }
    if (!goalId) {
      return next(new AppError('goalId is required.', 400));
    }

    email = email.toLowerCase().trim();
    const normalizedDate = normalizeDateToUTC(date);

    const updateFields = {};
    if (description !== undefined) {
      updateFields["goals.$[elem].description"] = description;
    }

    if (Object.keys(updateFields).length === 0) {
      return next(new AppError('At least one field to update must be provided.', 400));
    }

    const record = await DailyRecord.findOneAndUpdate(
      { email, date: normalizedDate, "goals.goalId": goalId },
      { $set: updateFields },
      {
        arrayFilters: [{ "elem.goalId": goalId }],
        new: true,
        runValidators: true,
      }
    );

    if (!record) {
      return next(new AppError('DailyRecord or matching goal item not found.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Goal updated successfully.',
      data: record,
    });
  })
);

/**
 * PATCH /reflection
 * Partially update a single reflection's fields.
 */
router.patch(
  '/reflection',
  catchAsync(async (req, res, next) => {
    let { email, date, goalId, assessment, reflectionText } = req.body;

    if (!email || !date) {
      return next(new AppError('email and date are required.', 400));
    }
    if (!goalId) {
      return next(new AppError('goalId is required.', 400));
    }

    email = email.toLowerCase().trim();
    const normalizedDate = normalizeDateToUTC(date);

    const updateFields = {};
    if (assessment !== undefined) {
      updateFields["reflections.$[elem].assessment"] = assessment;
    }
    if (reflectionText !== undefined) {
      updateFields["reflections.$[elem].reflectionText"] = reflectionText;
    }

    if (Object.keys(updateFields).length === 0) {
      return next(new AppError('At least one field to update must be provided.', 400));
    }

    const record = await DailyRecord.findOneAndUpdate(
      { email, date: normalizedDate, "reflections.goalId": goalId },
      { $set: updateFields },
      {
        arrayFilters: [{ "elem.goalId": goalId }],
        new: true,
        runValidators: true,
      }
    );

    if (!record) {
      return next(new AppError('DailyRecord or matching reflection item not found.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Reflection updated successfully.',
      data: record,
    });
  })
);

/**
 * PATCH /revision
 * Partially update a single revision's fields.
 */
router.patch(
  '/revision',
  catchAsync(async (req, res, next) => {
    let { email, date, topic, sourceGoalId, reason } = req.body;

    if (!email || !date) {
      return next(new AppError('email and date are required.', 400));
    }
    if (!topic || !sourceGoalId) {
      return next(new AppError('topic and sourceGoalId are required.', 400));
    }

    email = email.toLowerCase().trim();
    const normalizedDate = normalizeDateToUTC(date);

    const updateFields = {};
    if (reason !== undefined) {
      updateFields["revisions.$[elem].reason"] = reason;
    }

    if (Object.keys(updateFields).length === 0) {
      return next(new AppError('At least one field to update must be provided.', 400));
    }

    const record = await DailyRecord.findOneAndUpdate(
      { 
        email, 
        date: normalizedDate, 
        "revisions.topic": topic, 
        "revisions.sourceGoalId": sourceGoalId 
      },
      { $set: updateFields },
      {
        arrayFilters: [{ "elem.topic": topic, "elem.sourceGoalId": sourceGoalId }],
        new: true,
        runValidators: true,
      }
    );

    if (!record) {
      return next(new AppError('DailyRecord or matching revision item not found.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Revision updated successfully.',
      data: record,
    });
  })
);

// ──────────────────────────────────────────────
// 8. DELETE ROUTES
// ──────────────────────────────────────────────

/**
 * DELETE /goal
 * Pull a single goal out of the goals array.
 */
router.delete(
  '/goal',
  catchAsync(async (req, res, next) => {
    let { email, date, goalId } = req.body;

    if (!email || !date) {
      return next(new AppError('email and date are required.', 400));
    }
    if (!goalId) {
      return next(new AppError('goalId is required.', 400));
    }

    email = email.toLowerCase().trim();
    const normalizedDate = normalizeDateToUTC(date);

    const record = await DailyRecord.findOneAndUpdate(
      { email, date: normalizedDate, "goals.goalId": goalId },
      { $pull: { goals: { goalId } } },
      { new: true }
    );

    if (!record) {
      return next(new AppError('DailyRecord or matching goal item not found.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully.',
      data: record,
    });
  })
);

/**
 * DELETE /reflection
 * Pull a single reflection out of the reflections array.
 */
router.delete(
  '/reflection',
  catchAsync(async (req, res, next) => {
    let { email, date, goalId } = req.body;

    if (!email || !date) {
      return next(new AppError('email and date are required.', 400));
    }
    if (!goalId) {
      return next(new AppError('goalId is required.', 400));
    }

    email = email.toLowerCase().trim();
    const normalizedDate = normalizeDateToUTC(date);

    const record = await DailyRecord.findOneAndUpdate(
      { email, date: normalizedDate, "reflections.goalId": goalId },
      { $pull: { reflections: { goalId } } },
      { new: true }
    );

    if (!record) {
      return next(new AppError('DailyRecord or matching reflection item not found.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Reflection deleted successfully.',
      data: record,
    });
  })
);

/**
 * DELETE /revision
 * Pull a single revision out of the revisions array.
 */
router.delete(
  '/revision',
  catchAsync(async (req, res, next) => {
    let { email, date, topic, sourceGoalId } = req.body;

    if (!email || !date) {
      return next(new AppError('email and date are required.', 400));
    }
    if (!topic || !sourceGoalId) {
      return next(new AppError('topic and sourceGoalId are required.', 400));
    }

    email = email.toLowerCase().trim();
    const normalizedDate = normalizeDateToUTC(date);

    const record = await DailyRecord.findOneAndUpdate(
      { 
        email, 
        date: normalizedDate, 
        "revisions.topic": topic, 
        "revisions.sourceGoalId": sourceGoalId 
      },
      { $pull: { revisions: { topic, sourceGoalId } } },
      { new: true }
    );

    if (!record) {
      return next(new AppError('DailyRecord or matching revision item not found.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Revision deleted successfully.',
      data: record,
    });
  })
);

/**
 * DELETE /
 * Delete the entire DailyRecord for a student on a specific date.
 */
router.delete(
  '/',
  catchAsync(async (req, res, next) => {
    let { email, date } = req.body;

    if (!email || !date) {
      return next(new AppError('email and date are required.', 400));
    }

    email = email.toLowerCase().trim();
    const normalizedDate = normalizeDateToUTC(date);

    const record = await DailyRecord.findOneAndDelete({ email, date: normalizedDate });

    if (!record) {
      return next(new AppError('DailyRecord not found for this student and date.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Daily record deleted successfully.',
      data: record,
    });
  })
);

module.exports = router;
