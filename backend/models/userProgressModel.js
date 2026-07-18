const mongoose = require('mongoose');

/**
 * UserProgress Schema
 * Represents a student's current phase progression.
 * Fields:
 * - userId: References the User model. Unique per student.
 * - currentPhase: Number of the phase currently active (defaults to 1).
 * - completedPhases: Array of phase numbers that the student has completed.
 * - phaseDetails: Store start date for each phase and completion timestamp
 */
const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
    },
    currentPhase: {
      type: Number,
      default: 1,
    },
    completedPhases: {
      type: [Number],
      default: [],
    },
    phaseDetails: [{
      phase: { type: Number, required: true },
      startDate: { type: Date, default: Date.now },
      completedAt: { type: Date },
    }],
  },
  {
    timestamps: true,
  }
);

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

module.exports = UserProgress;
