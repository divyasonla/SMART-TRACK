const User = require('../models/userModel');

/**
 * UserRepository - MongoDB Persistence for Users
 */
class UserRepository {
  /**
   * Find a user by email address (case-insensitive)
   * @param {string} email 
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    if (!email) return null;
    const lowerEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: lowerEmail }).select('+password');
    if (!user) return null;
    return user;
  }

  /**
   * Create a new user record in MongoDB
   * @param {Object} userData 
   * @param {string} userData.fullName
   * @param {string} userData.email
   * @param {string} userData.password (hashed)
   * @returns {Promise<Object>}
   */
  async createUser({ fullName, email, password }) {
    const lowerEmail = email.toLowerCase().trim();
    const newUser = await User.create({
      fullName: fullName ? fullName.trim() : '',
      name: fullName ? fullName.trim() : '',
      email: lowerEmail,
      password,
    });

    const userObj = newUser.toObject();
    return {
      id: userObj._id.toString(),
      _id: userObj._id.toString(),
      fullName: userObj.fullName || userObj.name,
      name: userObj.name || userObj.fullName,
      email: userObj.email,
      createdAt: userObj.createdAt
    };
  }

  /**
   * Update user password in MongoDB
   * @param {string} email 
   * @param {string} newHashedPassword 
   * @returns {Promise<boolean>}
   */
  async updatePassword(email, newHashedPassword) {
    const lowerEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: lowerEmail });

    if (!user) {
      return false;
    }

    user.password = newHashedPassword;
    await user.save();
    return true;
  }

  /**
   * Get all registered users
   * @returns {Promise<Array>}
   */
  async getAllUsers() {
    const users = await User.find({}).select('-password');
    return users.map(u => ({
      id: u._id.toString(),
      fullName: u.fullName || u.name,
      email: u.email,
      createdAt: u.createdAt
    }));
  }
}

module.exports = new UserRepository();
