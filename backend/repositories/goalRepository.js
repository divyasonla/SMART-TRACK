const Goal = require('../models/goalModel');

class GoalRepository {
  /**
   * Create a new goal in the database
   * @param {Object} goalData - The goal fields to save
   * @returns {Promise<Object>} The created goal document
   */
  async createGoal(goalData) {
    return await Goal.create(goalData);
  }

  /**
   * Find all goals belonging to a specific user
   * @param {string} userId - ID of the user owning the goals
   * @returns {Promise<Array>} List of goal documents
   */
  async findGoalsByUser(userId) {
    return await Goal.find({ user: userId }).sort('-createdAt');
  }

  /**
   * Find a specific goal belonging to a specific user
   * @param {string} goalId - The unique Goal document ID
   * @param {string} userId - ID of the user owning the goal
   * @returns {Promise<Object|null>} Goal document or null
   */
  async findGoalByIdAndUser(goalId, userId) {
    return await Goal.findOne({ _id: goalId, user: userId });
  }

  /**
   * Update a specific goal belonging to a specific user
   * @param {string} goalId - The unique Goal document ID
   * @param {string} userId - ID of the user owning the goal
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object|null>} Updated goal document or null
   */
  async updateGoal(goalId, userId, updateData) {
    return await Goal.findOneAndUpdate(
      { _id: goalId, user: userId },
      updateData,
      { new: true, runValidators: true } // returns the updated document, runs validations
    );
  }

  /**
   * Delete a specific goal belonging to a specific user
   * @param {string} goalId - The unique Goal document ID
   * @param {string} userId - ID of the user owning the goal
   * @returns {Promise<Object|null>} Deleted goal document or null
   */
  async deleteGoal(goalId, userId) {
    return await Goal.findOneAndDelete({ _id: goalId, user: userId });
  }
}

module.exports = new GoalRepository();
