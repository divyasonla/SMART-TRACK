const User = require('../models/userModel');

class UserRepository {
  /**
   * Create a new user in the database
   * @param {Object} userData - Data for creating the user
   * @returns {Promise<Object>} The created user document
   */
  async createUser(userData) {
    return await User.create(userData);
  }

  /**
   * Find a user by email address
   * @param {string} email - Email address to search for
   * @returns {Promise<Object|null>} The user document or null
   */
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  /**
   * Find a user by email and explicitly select the password field
   * (needed for authentication comparison since password is select: false)
   * @param {string} email - Email address to search for
   * @returns {Promise<Object|null>} The user document with password or null
   */
  async findByEmailWithPassword(email) {
    return await User.findOne({ email }).select('+password');
  }

  /**
   * Find a user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} The user document or null
   */
  async findById(id) {
    return await User.findById(id);
  }
}

module.exports = new UserRepository();
