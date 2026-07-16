const Goal = require('../models/Goal');
const User = require('../models/userModel');
const Phase = require('../models/Phase');
const mongoose = require('mongoose');
const AppError = require('../utils/appError');

/**
 * Service layer for Goal CRUD operations.
 * All database logic lives here — controllers stay thin.
 */
class GoalService {
  /**
   * Normalize input fields to support both formats (e.g., student/studentId, phase/phaseId)
   */
  _normalizeData(data) {
    if (data.student && !data.studentId) {
      data.studentId = data.student;
    }
    if (data.phase && !data.phaseId) {
      data.phaseId = data.phase;
    }
    return data;
  }

  /**
   * Create a new goal for a student.
   * @param {Object} data - Goal fields from request body
   * @returns {Promise<Object>} - The created goal document
   */
  async createGoal(data) {
    data = this._normalizeData(data);

    // 1. Validate studentId existence
    if (!data.studentId) {
      throw new AppError('Goal must be associated with a User.', 400);
    }
    if (!mongoose.Types.ObjectId.isValid(data.studentId)) {
      throw new AppError('Invalid student ID format.', 400);
    }
    const studentExists = await User.exists({ _id: data.studentId });
    if (!studentExists) {
      throw new AppError('User with the provided ID does not exist.', 400);
    }

    // 2. Validate phaseId existence
    if (!data.phaseId) {
      throw new AppError('Goal must be linked to a Phase.', 400);
    }
    if (!mongoose.Types.ObjectId.isValid(data.phaseId)) {
      throw new AppError('Invalid phase ID format.', 400);
    }
    const phaseExists = await Phase.exists({ _id: data.phaseId });
    if (!phaseExists) {
      throw new AppError('Phase with the provided ID does not exist.', 400);
    }

    // 3. Create Goal
    const goal = await Goal.create(data);

    // 4. Return populated Goal
    return await Goal.findById(goal._id)
      .populate('studentId', 'name email')
      .populate('phaseId', 'title phaseNumber');
  }

  /**
   * Retrieve all goals, sorted by newest first.
   * Populates studentId and phaseId references.
   * @returns {Promise<Array>} - List of goal documents
   */
  async getAllGoals() {
    return await Goal.find()
      .populate('studentId', 'name email')
      .populate('phaseId', 'title phaseNumber')
      .sort({ createdAt: -1 });
  }

  /**
   * Retrieve a single goal by its MongoDB _id.
   * @param {string} id - The goal's ObjectId
   * @returns {Promise<Object>} - The found goal document
   */
  async getGoalById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Goal ID format.', 400);
    }

    const goal = await Goal.findById(id)
      .populate('studentId', 'name email')
      .populate('phaseId', 'title phaseNumber');

    if (!goal) {
      throw new AppError(`Goal with ID ${id} not found.`, 404);
    }
    return goal;
  }

  /**
   * Update a goal by ID.
   * @param {string} id - The goal's ObjectId
   * @param {Object} data - Fields to update
   * @returns {Promise<Object>} - The updated goal document
   */
  async updateGoal(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Goal ID format.', 400);
    }

    data = this._normalizeData(data);

    // If studentId is updated, validate it
    if (data.studentId) {
      if (!mongoose.Types.ObjectId.isValid(data.studentId)) {
        throw new AppError('Invalid student ID format.', 400);
      }
      const studentExists = await User.exists({ _id: data.studentId });
      if (!studentExists) {
        throw new AppError('User with the provided ID does not exist.', 400);
      }
    }

    // If phaseId is updated, validate it
    if (data.phaseId) {
      if (!mongoose.Types.ObjectId.isValid(data.phaseId)) {
        throw new AppError('Invalid phase ID format.', 400);
      }
      const phaseExists = await Phase.exists({ _id: data.phaseId });
      if (!phaseExists) {
        throw new AppError('Phase with the provided ID does not exist.', 400);
      }
    }

    const goal = await Goal.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate('studentId', 'name email')
      .populate('phaseId', 'title phaseNumber');

    if (!goal) {
      throw new AppError(`Goal with ID ${id} not found.`, 404);
    }
    return goal;
  }

  /**
   * Delete a goal by ID.
   * @param {string} id - The goal's ObjectId
   * @returns {Promise<Object>} - The deleted goal document
   */
  async deleteGoal(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Goal ID format.', 400);
    }

    const goal = await Goal.findByIdAndDelete(id);
    if (!goal) {
      throw new AppError(`Goal with ID ${id} not found.`, 404);
    }
    return goal;
  }
}

module.exports = new GoalService();
