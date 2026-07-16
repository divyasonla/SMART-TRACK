const userRepository = require('../repositories/userRepository');
const { signToken } = require('../utils/tokenUtils');
const AppError = require('../utils/appError');

class AuthService {
  /**
   * Handle user registration business logic.
   * @param {Object} userData - Registration details (name, email, password, role)
   * @returns {Promise<Object>} Object containing user details and signed JWT token
   */
  async registerUser(userData) {
    const { name, email, password, role, campus, gender, joiningDate } = userData;

    // 1. Check if email is already in use
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email address is already in use.', 400);
    }

    // 2. Create the user document (Mongoose pre-save hook will hash password)
    const newUser = await userRepository.createUser({
      name,
      email,
      password,
      role,
      campus,
      gender,
      joiningDate,
    });

    // 3. Generate a JWT token
    const token = signToken(newUser._id);

    // 4. Remove password from the returned object (just in case)
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return {
      user: userResponse,
      token,
    };
  }

  /**
   * Handle user login business logic.
   * @param {string} email - User email address
   * @param {string} password - User plain text password
   * @returns {Promise<Object>} Object containing user details and signed JWT token
   */
  async loginUser(email, password) {
    // 1. Retrieve user and include password hash
    const user = await userRepository.findByEmailWithPassword(email);

    // 2. Check if user exists and password matches
    // Note: We use a generic message to prevent user enumeration attacks
    if (!user || !(await user.comparePassword(password, user.password))) {
      throw new AppError('Incorrect email or password.', 401);
    }

    // 3. Generate a JWT token
    const token = signToken(user._id);

    // 4. Remove password from the returned user object
    const userResponse = user.toObject();
    delete userResponse.password;

    return {
      user: userResponse,
      token,
    };
  }
}

module.exports = new AuthService();