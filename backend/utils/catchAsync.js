/**
 * Wraps an asynchronous express controller function.
 * Automatically catches any rejected promises (errors) and passes them to next(),
 * eliminating the need for repeated try-catch blocks in controller code.
 * 
 * @param {Function} fn - The asynchronous middleware/controller function
 * @returns {Function} - The wrapped middleware function
 */
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
