const Joi = require('joi');

const addWishlistProductSchema = {
  body: Joi.object({
    productId: Joi.string().hex().length(24).required(),
  }),
};

const wishlistProductParamsSchema = {
  params: Joi.object({
    productId: Joi.string().hex().length(24).required(),
  }),
};

module.exports = {
  addWishlistProductSchema,
  wishlistProductParamsSchema,
};
