const mongoose = require('mongoose');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// ──────────────────────────────────────────────
// 1. STUDENT SCHEMA & MODEL
// ──────────────────────────────────────────────

/**
 * Student Model
 * Represents a student profile in the Goal & Reflection Tracker.
 */
const studentSchema = new mongoose.Schema(
  {
    // Reference to the main User model for authentication/account details
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student profile must be linked to a User account.'],
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required.'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address.',
      ],
    },
    // The specific campus where the student is enrolled
    campus: {
      type: String,
      required: [true, 'Campus is required.'],
      trim: true,
    },
    // The cohort or batch code of the student
    batch: {
      type: String,
      required: [true, 'Batch is required.'],
      trim: true,
    },
    // The current learning phase the student is working on
    currentPhase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Phase',
      default: null,
    },
    // Number of consecutive days the student has set/updated goals
    streak: {
      type: Number,
      default: 0,
      min: [0, 'Streak cannot be negative.'],
    },
    // Aggregated counter of all completed goals for progress metrics
    totalGoalsCompleted: {
      type: Number,
      default: 0,
      min: [0, 'Total goals completed cannot be negative.'],
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const Student = mongoose.model('Student', studentSchema);


module.exports = {
  Student,
};

