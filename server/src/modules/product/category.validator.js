const Joi = require('joi');

const categorySchema = {
  body: Joi.object().keys({
    name: Joi.string().required().max(50).trim(),
    description: Joi.string().max(500).allow('', null).trim(),
    isActive: Joi.boolean().default(true),
  }),
};

const updateCategorySchema = {
  params: Joi.object().keys({
    id: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
  }),
  body: Joi.object().keys({
    name: Joi.string().max(50).trim(),
    description: Joi.string().max(500).allow('', null).trim(),
    isActive: Joi.boolean(),
  }).min(1),
};

module.exports = {
  categorySchema,
  updateCategorySchema,
};
