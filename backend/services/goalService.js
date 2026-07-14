const goalRepository = require('../repositories/goalRepository');
const AppError = require('../utils/appError');

class GoalService {
  /**
   * Business logic to create a new goal.
   * @param {string} userId - Owner of the goal
   * @param {Object} goalData - Fields describing the goal
   * @returns {Promise<Object>} The saved goal document
   */
  async createGoal(userId, goalData) {
    // Injects the authenticated user ID to tie ownership
    const completeGoalData = {
      ...goalData,
      user: userId,
    };

    return await goalRepository.createGoal(completeGoalData);
  }

  /**
   * Business logic to get all goals for a user.
   * @param {string} userId - User ID
   * @returns {Promise<Array>} List of goal documents
   */
  async getUserGoals(userId) {
    return await goalRepository.findGoalsByUser(userId);
  }

  /**
   * Business logic to get a specific goal.
   * @param {string} goalId - Unique ID of the goal
   * @param {string} userId - Owner of the goal
   * @returns {Promise<Object>} Goal document
   */
  async getGoal(goalId, userId) {
    const goal = await goalRepository.findGoalByIdAndUser(goalId, userId);
    if (!goal) {
      throw new AppError('Goal not found or access denied.', 404);
    }
    return goal;
  }

  /**
   * Business logic to update a specific goal.
   * @param {string} goalId - Unique ID of the goal
   * @param {string} userId - Owner of the goal
   * @param {Object} updateData - Update values
   * @returns {Promise<Object>} Updated goal document
   */
  async updateGoal(goalId, userId, updateData) {
    const updatedGoal = await goalRepository.updateGoal(goalId, userId, updateData);
    if (!updatedGoal) {
      throw new AppError('Goal not found or access denied.', 404);
    }
    return updatedGoal;
  }

  /**
   * Business logic to delete a specific goal.
   * @param {string} goalId - Unique ID of the goal
   * @param {string} userId - Owner of the goal
   * @returns {Promise<Object>} Deleted goal document
   */
  async deleteGoal(goalId, userId) {
    const deletedGoal = await goalRepository.deleteGoal(goalId, userId);
    if (!deletedGoal) {
      throw new AppError('Goal not found or access denied.', 404);
    }
    return deletedGoal;
  }
}

module.exports = new GoalService();
