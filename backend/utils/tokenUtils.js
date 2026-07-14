const jwt = require('jsonwebtoken');

/**
 * Generates a signed JSON Web Token (JWT) for a user ID.
 * @param {string} id - The MongoDB user document ID
 * @returns {string} The signed JWT
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * Verifies a JSON Web Token (JWT) and returns its decoded payload.
 * Wraps jwt.verify in a Promise for clean async/await usage.
 * @param {string} token - The raw JWT string
 * @returns {Promise<Object>} Decoded token payload containing user ID
 */
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
};

module.exports = {
  signToken,
  verifyToken,
};
