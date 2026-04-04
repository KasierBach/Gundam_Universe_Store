const ApiError = require('../utils/ApiError');

/**
 * Request validation middleware using Joi schemas
 * @param {Object} schema - Joi schema object with body, query, and/or params
 * @returns {Function} Express middleware
 */
const validate = (schema) => {
  return (req, _res, next) => {
    const validationErrors = [];

    for (const key of ['body', 'query', 'params']) {
      if (!schema[key]) continue;

      const { error, value } = schema[key].validate(req[key], {
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: false,
      });

      if (error) {
        const messages = error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message.replace(/"/g, ''),
        }));
        validationErrors.push(...messages);
      } else {
        req[key] = value; // Use validated/sanitized values
      }
    }

    if (validationErrors.length > 0) {
      throw ApiError.badRequest('Validation failed', validationErrors);
    }

    next();
  };
};

module.exports = { validate };
