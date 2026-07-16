const mongoose = require('mongoose');

/**
 * Reflection Model
 * Captures a student's daily or goal-oriented review and learnings.
 */
const reflectionSchema = new mongoose.Schema(
  {
    // Reference to the User who wrote the reflection
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reflection must be associated with a User.'],
    },
    // Reference to the Goal this reflection is based on
    goalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal',
      required: [true, 'Reflection must be associated with a specific Goal.'],
    },
    // The date when the reflection was recorded
    date: {
      type: Date,
      required: [true, 'Reflection date is required.'],
      default: Date.now,
    },
    whatWentWell: {
      type: String,
      required: [true, 'Please describe what went well today.'],
      trim: true,
    },
    whatWasDifficult: {
      type: String,
      required: [true, 'Please describe what was difficult or challenging.'],
      trim: true,
    },
    whatDidILearn: {
      type: String,
      required: [true, 'Please describe what you learned.'],
      trim: true,
    },
    tomorrowPlan: {
      type: String,
      required: [true, 'Please share your plans or goals for tomorrow.'],
      trim: true,
    },
    // AI generated summary or analysis based on the student's inputs
    aiSummary: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes to speed up queries by student and date
reflectionSchema.index({ studentId: 1, date: -1 });

const Reflection = mongoose.model('Reflection', reflectionSchema);

module.exports = Reflection;
