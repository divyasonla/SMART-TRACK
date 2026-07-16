const mongoose = require('mongoose');

/**
 * Progress Model
 * Tracks a student's daily updates, blockers, and time spent on a specific goal.
 */
const progressSchema = new mongoose.Schema(
  {
    // Reference to the User who owns this progress record
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Progress must be linked to a User.'],
    },
    // Reference to the Goal this progress applies to
    goalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal',
      required: [true, 'Progress must refer to a specific Goal.'],
      unique: true, // One progress tracking document per goal
    },
    // Student's update in the morning (e.g. what they plan to do)
    morningUpdate: {
      type: String,
      trim: true,
      default: '',
    },
    // Student's update in the afternoon (e.g. check-in status)
    afternoonUpdate: {
      type: String,
      trim: true,
      default: '',
    },
    // Student's update in the evening (e.g. final status of the day)
    eveningUpdate: {
      type: String,
      trim: true,
      default: '',
    },
    // Any roadblocks, issues, or technical challenges faced
    blockers: {
      type: String,
      trim: true,
      default: '',
    },
    // Estimated time spent on this goal in minutes or hours (e.g. 120 minutes)
    timeSpent: {
      type: Number,
      default: 0,
      min: [0, 'Time spent cannot be negative.'],
    },
    // Numeric value representing current completion progress for this specific goal (0 - 100)
    completionPercentage: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Completion percentage cannot be less than 0.'],
      max: [100, 'Completion percentage cannot exceed 100.'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes to speed up queries by student
progressSchema.index({ studentId: 1 });

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
