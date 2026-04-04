const Joi = require('joi');
const { PRODUCT_GRADES, PRODUCT_RARITIES, PRODUCT_CONDITIONS } = require('../../shared/constants/productConstants');

const productSchema = {
  body: Joi.object().keys({
    name: Joi.string().required().max(100).trim(),
    description: Joi.string().required().max(2000).trim(),
    price: Joi.number().required().min(0),
    stock: Joi.number().required().min(0).default(0),
    category: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
    grade: Joi.string().valid(...Object.values(PRODUCT_GRADES)).default(PRODUCT_GRADES.NONE),
    series: Joi.string().max(50).trim().default('Unknown'),
    rarity: Joi.string().valid(...Object.values(PRODUCT_RARITIES)).default(PRODUCT_RARITIES.COMMON),
    condition: Joi.string().valid(...Object.values(PRODUCT_CONDITIONS)).default(PRODUCT_CONDITIONS.NEW),
    specs: Joi.object().keys({
      scale: Joi.string().max(20).allow('', null).trim(),
      material: Joi.string().max(100).allow('', null).trim(),
      dimensions: Joi.string().max(100).allow('', null).trim(),
      weight: Joi.string().max(50).allow('', null).trim(),
    }),
    images: Joi.array().items(
      Joi.object().keys({
        url: Joi.string().uri().required(),
        publicId: Joi.string().required(),
        isMain: Joi.boolean().default(false),
      })
    ).min(1).required(),
    status: Joi.string().valid('active', 'inactive', 'out_of_stock', 'archived').default('active'),
    tags: Joi.array().items(Joi.string().trim()),
  }),
};

const updateProductSchema = {
  params: Joi.object().keys({
    id: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
  }),
  body: Joi.object().keys({
    name: Joi.string().max(100).trim(),
    description: Joi.string().max(2000).trim(),
    price: Joi.number().min(0),
    stock: Joi.number().min(0),
    category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    grade: Joi.string().valid(...Object.values(PRODUCT_GRADES)),
    series: Joi.string().max(50).trim(),
    rarity: Joi.string().valid(...Object.values(PRODUCT_RARITIES)),
    condition: Joi.string().valid(...Object.values(PRODUCT_CONDITIONS)),
    specs: Joi.object().keys({
      scale: Joi.string().max(20).allow('', null).trim(),
      material: Joi.string().max(100).allow('', null).trim(),
      dimensions: Joi.string().max(100).allow('', null).trim(),
      weight: Joi.string().max(50).allow('', null).trim(),
    }),
    images: Joi.array().items(
      Joi.object().keys({
        url: Joi.string().uri().required(),
        publicId: Joi.string().required(),
        isMain: Joi.boolean().default(false),
      })
    ).min(1),
    status: Joi.string().valid('active', 'inactive', 'out_of_stock', 'archived'),
    tags: Joi.array().items(Joi.string().trim()),
  }).min(1),
};

const queryProductSchema = {
  query: Joi.object().keys({
    name: Joi.string().allow('', null),
    category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    grade: Joi.string().valid(...Object.values(PRODUCT_GRADES)),
    series: Joi.string().allow('', null),
    rarity: Joi.string().valid(...Object.values(PRODUCT_RARITIES)),
    condition: Joi.string().valid(...Object.values(PRODUCT_CONDITIONS)),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    status: Joi.string().valid('active', 'inactive', 'out_of_stock', 'archived'),
    sortBy: Joi.string().allow('', null),
    order: Joi.string().valid('asc', 'desc').default('desc'),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),
};

const recommendationParamsSchema = {
  params: Joi.object().keys({
    slug: Joi.string().required().trim(),
  }),
  query: Joi.object().keys({
    limit: Joi.number().integer().min(1).max(12).default(4),
  }),
};

module.exports = {
  productSchema,
  updateProductSchema,
  queryProductSchema,
  recommendationParamsSchema,
};
