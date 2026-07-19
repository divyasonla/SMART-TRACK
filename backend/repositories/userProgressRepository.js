const UserProgress = require('../models/userProgressModel');

class UserProgressRepository {
  /**
   * Find a user's progress by their userId.
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} The progress document
   */
  async findProgressByUserId(userId) {
    return await UserProgress.findOne({ userId });
  }

  /**
   * Find a user's progress, or create a default progress entry (starting at Phase 1) if it doesn't exist.
   * @param {string} userId - User ID
   * @returns {Promise<Object>} The progress document
   */
  async findOrCreateProgress(userId) {
    let progress = await this.findProgressByUserId(userId);
    if (!progress) {
      progress = await UserProgress.create({
        userId,
        currentPhase: 1,
        completedPhases: [],
        phaseDetails: [{ phase: 1, startDate: new Date() }],
      });
    }
    return progress;
  }

  /**
   * Save changes to a user's progress document.
   * @param {Object} progressDoc - Mongoose document
   * @returns {Promise<Object>} Saved document
   */
  async saveProgress(progressDoc) {
    return await progressDoc.save();
  }
}

module.exports = new UserProgressRepository();
