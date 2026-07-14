const { Student } = require('../models/Student');
const mongoose = require('mongoose');
const AppError = require('../utils/appError');

/**
 * Service layer for Student CRUD operations.
 * All database logic lives here — controllers stay thin.
 */
class StudentService {
  /**
   * Create a new student profile.
   * @param {Object} data - Student fields from request body
   * @returns {Promise<Object>} - The created student document
   */
  async createStudent(data) {
    return await Student.create(data);
  }

  /**
   * Retrieve all students, sorted by newest first.
   * Populates the currentPhase reference for convenience.
   * @returns {Promise<Array>} - List of student documents
   */
  async getAllStudents() {
    return await Student.find().populate('currentPhase').sort({ createdAt: -1 });
  }

  /**
   * Retrieve a single student by their MongoDB _id.
   * @param {string} id - The student's ObjectId
   * @returns {Promise<Object>} - The found student document
   */
  async getStudentById(id) {
    // Validate ObjectId format before hitting the DB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Student ID format.', 400);
    }

    const student = await Student.findById(id).populate('currentPhase');
    if (!student) {
      throw new AppError(`Student with ID ${id} not found.`, 404);
    }
    return student;
  }

  /**
   * Update a student by ID.
   * @param {string} id - The student's ObjectId
   * @param {Object} data - Fields to update
   * @returns {Promise<Object>} - The updated student document
   */
  async updateStudent(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Student ID format.', 400);
    }

    const student = await Student.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate('currentPhase');

    if (!student) {
      throw new AppError(`Student with ID ${id} not found.`, 404);
    }
    return student;
  }

  /**
   * Delete a student by ID.
   * @param {string} id - The student's ObjectId
   * @returns {Promise<Object>} - The deleted student document
   */
  async deleteStudent(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Student ID format.', 400);
    }

    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      throw new AppError(`Student with ID ${id} not found.`, 404);
    }
    return student;
  }
}

module.exports = new StudentService();
