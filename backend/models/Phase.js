const mongoose = require('mongoose');

/**
 * Phase Model
 * Represents a learning phase from the curriculum.
 */
const phaseSchema = new mongoose.Schema(
  {
    phaseNumber: {
      type: Number,
      required: [true, 'Phase number is required.'],
      unique: true,
      min: [0, 'Phase number cannot be negative.'],
    },
    title: {
      type: String,
      required: [true, 'Phase title is required.'],
      trim: true,
    },
    durationDays: {
      type: Number,
      required: [true, 'Duration in days is required.'],
      min: [1, 'Duration must be at least 1 day.'],
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty level is required.'],
      enum: {
        values: ['Beginner', 'Intermediate', 'Advanced'],
        message: '{VALUE} is not a valid difficulty level.',
      },
      default: 'Intermediate',
    },
    prerequisite: {
      type: String,
      default: null,
      trim: true,
    },
    learningObjectives: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    thinkingSkills: {
      type: [String],
      default: [],
    },
    concepts: {
      type: [String],
      default: [],
    },
    goalSuggestions: {
      type: [String],
      default: [],
    },
    reflectionQuestions: {
      type: [String],
      default: [],
    },
    // Flexible object to store phase project details (e.g. title, deliverables)
    project: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    // Flexible object to store assessment criteria, rubric, or presentation requirements
    assessment: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Phase = mongoose.model('Phase', phaseSchema);

module.exports = Phase;
