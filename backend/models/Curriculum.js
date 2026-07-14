const mongoose = require('mongoose');

// Principle Sub-schema
const principleSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String
}, { _id: false });

// Milestone Sub-schema
const milestoneSchema = new mongoose.Schema({
  id: String,
  title: String,
  durationMonths: String
}, { _id: false });

// Module Sub-schema
const moduleSchema = new mongoose.Schema({
  title: String,
  topics: [String]
}, { _id: false });

// Project Sub-schema
const projectSchema = new mongoose.Schema({
  title: String
}, { _id: false });

// Assessment Sub-schema
const assessmentSchema = new mongoose.Schema({
  projectQA: Boolean,
  youtubeExplanation: Boolean,
  rubric: {
    logic: Number,
    codeQuality: Number,
    projectCompletion: Number,
    communication: Number
  }
}, { _id: false });

// Smart Goal Criteria Sub-schema
const smartGoalSchema = new mongoose.Schema({
  expectedDurationHours: Number,
  mustContainActionVerb: Boolean,
  mustContainDeliverable: Boolean,
  expectedKeywords: [String],
  actionVerbs: [String],
  mustMentionDeliverable: Boolean
}, { _id: false });

// Phase Sub-schema
const phaseSchema = new mongoose.Schema({
  id: { type: String, required: true },
  phaseNumber: { type: Number, required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true }, // Populated during seed for semantic querying
  durationDays: { type: Number, required: true },
  difficulty: { type: String, default: 'Intermediate' },
  prerequisite: { type: String, default: null },
  learningObjectives: [String],
  goalSuggestions: [String],
  smartGoalCriteria: smartGoalSchema,
  technologies: [String],
  modules: [moduleSchema],
  project: projectSchema,
  assessment: assessmentSchema,
  reflectionQuestions: [String]
}, { _id: false });

// Root Curriculum Schema
const curriculumSchema = new mongoose.Schema({
  curriculumId: { type: String, required: true, unique: true }, // Renamed from 'id' to avoid conflict with Mongoose's built-in 'id' virtual
  title: { type: String, required: true },
  version: { type: String, required: true },
  goal: { type: String, required: true },
  pedagogy: {
    principles: [principleSchema]
  },
  milestones: [milestoneSchema],
  phases: [phaseSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Curriculum = mongoose.model('Curriculum', curriculumSchema);

module.exports = Curriculum;
