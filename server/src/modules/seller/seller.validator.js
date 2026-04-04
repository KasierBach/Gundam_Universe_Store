const Joi = require('joi');

const SELLER_PRODUCT_STATUSES = ['active', 'inactive', 'out_of_stock', 'archived'];
const SELLER_ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const sellerProductParamsSchema = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};

const sellerProductUpdateSchema = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object({
    stock: Joi.number().integer().min(0),
    status: Joi.string().valid(...SELLER_PRODUCT_STATUSES),
    price: Joi.number().min(0),
  }).min(1),
};

const sellerOrderUpdateSchema = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object({
    status: Joi.string().valid(...SELLER_ORDER_STATUSES).required(),
  }),
};

module.exports = {
  sellerProductParamsSchema,
  sellerProductUpdateSchema,
  sellerOrderUpdateSchema,
};
