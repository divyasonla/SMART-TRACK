const Task = require('../models/taskModel');
const AppError = require('../utils/appError');

/**
 * Service class handling all business operations for Tasks.
 * Decouples the Mongoose operations from the Express request/response layer.
 */
class TaskService {
  /**
   * Creates a new task.
   * @param {Object} taskData - Data of the task to be created
   * @returns {Promise<Object>} - The created task
   */
  async createTask(taskData) {
    return await Task.create(taskData);
  }

  /**
   * Retrieves all tasks.
   * @returns {Promise<Array>} - List of all tasks
   */
  async getAllTasks() {
    return await Task.find().sort({ createdAt: -1 });
  }

  /**
   * Retrieves a single task by ID.
   * Throws an operational AppError if not found.
   * @param {string} id - Task ID
   * @returns {Promise<Object>} - The found task
   */
  async getTaskById(id) {
    const task = await Task.findById(id);
    if (!task) {
      throw new AppError(`Task with ID ${id} not found.`, 404);
    }
    return task;
  }

  /**
   * Updates a task by ID.
   * Throws an operational AppError if not found.
   * @param {string} id - Task ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - The updated task
   */
  async updateTask(id, updateData) {
    // runValidators: true makes sure schema validations run on updates too
    const task = await Task.findByIdAndUpdate(id, updateData, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!task) {
      throw new AppError(`Task with ID ${id} not found.`, 404);
    }
    return task;
  }

  /**
   * Deletes a task by ID.
   * Throws an operational AppError if not found.
   * @param {string} id - Task ID
   * @returns {Promise<Object>} - The deleted task
   */
  async deleteTask(id) {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      throw new AppError(`Task with ID ${id} not found.`, 404);
    }
    return task;
  }
}

module.exports = new TaskService();
