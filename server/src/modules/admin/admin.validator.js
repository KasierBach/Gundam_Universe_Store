const Joi = require('joi');
const { TRADE_LISTING_STATUS } = require('../../shared/constants/tradeStatus');

const tradeModerationSchema = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object({
    status: Joi.string().valid(...Object.values(TRADE_LISTING_STATUS)).required(),
  }),
};

module.exports = {
  tradeModerationSchema,
};
