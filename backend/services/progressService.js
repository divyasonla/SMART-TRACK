const Progress = require('../models/Progress');
const Goal = require('../models/Goal');
const { Student } = require('../models/Student');
const mongoose = require('mongoose');
const AppError = require('../utils/appError');

/**
 * Service layer for Progress CRUD operations.
 * All database logic lives here — controllers stay thin.
 */
class ProgressService {
  /**
   * Normalize input fields to support both formats (e.g., goal/goalId, student/studentId)
   */
  _normalizeData(data) {
    if (data.goal && !data.goalId) {
      data.goalId = data.goal;
    }
    if (data.student && !data.studentId) {
      data.studentId = data.student;
    }
    return data;
  }

  /**
   * Create a new progress record for a goal.
   * @param {Object} data - Progress fields from request body
   * @returns {Promise<Object>} - The created progress document
   */
  async createProgress(data) {
    data = this._normalizeData(data);

    // 1. Validate studentId existence
    if (!data.studentId) {
      throw new AppError('Progress must be linked to a Student.', 400);
    }
    if (!mongoose.Types.ObjectId.isValid(data.studentId)) {
      throw new AppError('Invalid student ID format.', 400);
    }
    const studentExists = await Student.exists({ _id: data.studentId });
    if (!studentExists) {
      throw new AppError('Student with the provided ID does not exist.', 400);
    }

    // 2. Validate goalId existence
    if (!data.goalId) {
      throw new AppError('Progress must refer to a specific Goal.', 400);
    }
    if (!mongoose.Types.ObjectId.isValid(data.goalId)) {
      throw new AppError('Invalid goal ID format.', 400);
    }
    const goalExists = await Goal.exists({ _id: data.goalId });
    if (!goalExists) {
      throw new AppError('Goal with the provided ID does not exist.', 400);
    }

    // 3. Check uniqueness (One progress tracking document per goal)
    const progressExists = await Progress.exists({ goalId: data.goalId });
    if (progressExists) {
      throw new AppError('Progress record already exists for this Goal.', 400);
    }

    // 4. Create Progress
    const progress = await Progress.create(data);

    // 5. Return populated Progress
    return await Progress.findById(progress._id)
      .populate('studentId', 'fullName email')
      .populate('goalId', 'title status');
  }

  /**
   * Retrieve all progress records, sorted by newest first.
   * Populates studentId and goalId references.
   * @returns {Promise<Array>} - List of progress documents
   */
  async getAllProgress() {
    return await Progress.find()
      .populate('studentId', 'fullName email')
      .populate('goalId', 'title status')
      .sort({ createdAt: -1 });
  }

  /**
   * Retrieve a single progress record by its MongoDB _id.
   * @param {string} id - The progress document's ObjectId
   * @returns {Promise<Object>} - The found progress document
   */
  async getProgressById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Progress ID format.', 400);
    }

    const progress = await Progress.findById(id)
      .populate('studentId', 'fullName email')
      .populate('goalId', 'title status');

    if (!progress) {
      throw new AppError(`Progress with ID ${id} not found.`, 404);
    }
    return progress;
  }

  /**
   * Update a progress record by ID.
   * @param {string} id - The progress document's ObjectId
   * @param {Object} data - Fields to update
   * @returns {Promise<Object>} - The updated progress document
   */
  async updateProgress(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Progress ID format.', 400);
    }

    data = this._normalizeData(data);

    // If studentId is updated, validate it
    if (data.studentId) {
      if (!mongoose.Types.ObjectId.isValid(data.studentId)) {
        throw new AppError('Invalid student ID format.', 400);
      }
      const studentExists = await Student.exists({ _id: data.studentId });
      if (!studentExists) {
        throw new AppError('Student with the provided ID does not exist.', 400);
      }
    }

    // If goalId is updated, validate it
    if (data.goalId) {
      if (!mongoose.Types.ObjectId.isValid(data.goalId)) {
        throw new AppError('Invalid goal ID format.', 400);
      }
      const goalExists = await Goal.exists({ _id: data.goalId });
      if (!goalExists) {
        throw new AppError('Goal with the provided ID does not exist.', 400);
      }
    }

    const progress = await Progress.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate('studentId', 'fullName email')
      .populate('goalId', 'title status');

    if (!progress) {
      throw new AppError(`Progress with ID ${id} not found.`, 404);
    }
    return progress;
  }

  /**
   * Delete a progress record by ID.
   * @param {string} id - The progress document's ObjectId
   * @returns {Promise<Object>} - The deleted progress document
   */
  async deleteProgress(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Progress ID format.', 400);
    }

    const progress = await Progress.findByIdAndDelete(id);
    if (!progress) {
      throw new AppError(`Progress with ID ${id} not found.`, 404);
    }
    return progress;
  }
}

module.exports = new ProgressService();
