const Joi = require('joi');
const { PRODUCT_CONDITIONS } = require('../../shared/constants/productConstants');
const { TRADE_LISTING_STATUS, TRADE_OFFER_STATUS } = require('../../shared/constants/tradeStatus');

const createListingSchema = {
  body: Joi.object().keys({
    title: Joi.string().required().max(150).trim(),
    description: Joi.string().required().max(1000).trim(),
    wantedItems: Joi.string().required().max(500).trim(),
    condition: Joi.string().valid(...Object.values(PRODUCT_CONDITIONS)).required(),
    images: Joi.array().items(
      Joi.object().keys({
        url: Joi.string().uri().required(),
        publicId: Joi.string().required(),
      })
    ).min(1).max(5),
  }),
};

const queryListingSchema = {
  query: Joi.object().keys({
    status: Joi.string().valid(...Object.values(TRADE_LISTING_STATUS)),
    condition: Joi.string().valid(...Object.values(PRODUCT_CONDITIONS)),
    owner: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    sortBy: Joi.string().allow('', null),
    order: Joi.string().valid('asc', 'desc').default('desc'),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),
};

const suggestionQuerySchema = {
  query: Joi.object().keys({
    limit: Joi.number().integer().min(1).max(12).default(6),
  }),
};

const createOfferSchema = {
  body: Joi.object().keys({
    offeredItemsDescription: Joi.string().required().max(500).trim(),
    images: Joi.array().items(
      Joi.object().keys({
        url: Joi.string().uri().required(),
        publicId: Joi.string().required(),
      })
    ).min(1).max(5),
  }),
};

const updateOfferStatusSchema = {
  params: Joi.object().keys({
    id: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/), // listingId
    offerId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
  }),
  body: Joi.object().keys({
    status: Joi.string()
      .valid(TRADE_OFFER_STATUS.ACCEPTED, TRADE_OFFER_STATUS.REJECTED)
      .required(),
  }),
};

module.exports = {
  createListingSchema,
  queryListingSchema,
  suggestionQuerySchema,
  createOfferSchema,
  updateOfferStatusSchema,
};
