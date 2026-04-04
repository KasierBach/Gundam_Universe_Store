const Joi = require('joi');

const updateProfileSchema = {
  body: Joi.object({
    displayName: Joi.string().trim().min(2).max(50),
    phone: Joi.string().trim().allow('').max(15),
    address: Joi.object({
      street: Joi.string().trim().allow('').max(200),
      ward: Joi.string().trim().allow('').max(100),
      district: Joi.string().trim().allow('').max(100),
      city: Joi.string().trim().allow('').max(100),
    }),
  }),
};

module.exports = { updateProfileSchema };
