const Joi = require('joi');

const queryNotificationsSchema = {
  query: Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(30),
  }),
};

const notificationIdParamsSchema = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};

module.exports = {
  queryNotificationsSchema,
  notificationIdParamsSchema,
};
