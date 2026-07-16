const jwt = require('jsonwebtoken');

/**
 * Signs a JWT token for a given user ID.
 * Expiration is set to 7 days.
 */
exports.signToken = (id) => {
  const secret = process.env.JWT_SECRET || 'defaultsecret';
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};
