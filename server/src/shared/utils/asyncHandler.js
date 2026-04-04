/**
 * Wraps async route handlers to catch errors and pass to Express error handler.
 * Eliminates try-catch boilerplate in every controller method.
 * @param {Function} fn - Async function (req, res, next)
 * @returns {Function}
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
