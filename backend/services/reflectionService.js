const Reflection = require('../models/Reflection');
const Goal = require('../models/Goal');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const AppError = require('../utils/appError');

/**
 * Service layer for Reflection CRUD operations.
 * All database logic lives here — controllers stay thin.
 */
class ReflectionService {
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
   * Create a new reflection entry.
   * @param {Object} data - Reflection fields from request body
   * @returns {Promise<Object>} - The created reflection document
   */
  async createReflection(data) {
    data = this._normalizeData(data);

    // 1. Validate studentId existence
    if (!data.studentId) {
      throw new AppError('Reflection must be associated with a User.', 400);
    }
    if (!mongoose.Types.ObjectId.isValid(data.studentId)) {
      throw new AppError('Invalid student ID format.', 400);
    }
    const studentExists = await User.exists({ _id: data.studentId });
    if (!studentExists) {
      throw new AppError('User with the provided ID does not exist.', 400);
    }

    // 2. Validate goalId existence
    if (!data.goalId) {
      throw new AppError('Reflection must be associated with a specific Goal.', 400);
    }
    if (!mongoose.Types.ObjectId.isValid(data.goalId)) {
      throw new AppError('Invalid goal ID format.', 400);
    }
    const goalExists = await Goal.exists({ _id: data.goalId });
    if (!goalExists) {
      throw new AppError('Goal with the provided ID does not exist.', 400);
    }

    // 3. Create Reflection
    const reflection = await Reflection.create(data);

    // 4. Return populated Reflection
    return await Reflection.findById(reflection._id)
      .populate('studentId', 'name email')
      .populate('goalId', 'title status');
  }

  /**
   * Retrieve all reflections, sorted by most recent date first.
   * Populates studentId and goalId references.
   * @returns {Promise<Array>} - List of reflection documents
   */
  async getAllReflections() {
    return await Reflection.find()
      .populate('studentId', 'name email')
      .populate('goalId', 'title status')
      .sort({ date: -1 });
  }

  /**
   * Retrieve a single reflection by its MongoDB _id.
   * @param {string} id - The reflection's ObjectId
   * @returns {Promise<Object>} - The found reflection document
   */
  async getReflectionById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Reflection ID format.', 400);
    }

    const reflection = await Reflection.findById(id)
      .populate('studentId', 'name email')
      .populate('goalId', 'title status');

    if (!reflection) {
      throw new AppError(`Reflection with ID ${id} not found.`, 404);
    }
    return reflection;
  }

  /**
   * Update a reflection by ID.
   * @param {string} id - The reflection's ObjectId
   * @param {Object} data - Fields to update
   * @returns {Promise<Object>} - The updated reflection document
   */
  async updateReflection(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Reflection ID format.', 400);
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

    const reflection = await Reflection.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate('studentId', 'name email')
      .populate('goalId', 'title status');

    if (!reflection) {
      throw new AppError(`Reflection with ID ${id} not found.`, 404);
    }
    return reflection;
  }

  /**
   * Delete a reflection by ID.
   * @param {string} id - The reflection's ObjectId
   * @returns {Promise<Object>} - The deleted reflection document
   */
  async deleteReflection(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Reflection ID format.', 400);
    }

    const reflection = await Reflection.findByIdAndDelete(id);
    if (!reflection) {
      throw new AppError(`Reflection with ID ${id} not found.`, 404);
    }
    return reflection;
  }
}

module.exports = new ReflectionService();
