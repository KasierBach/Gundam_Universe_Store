const Joi = require('joi');
const { REPORT_STATUSES } = require('./report.model');

const createTradeReportSchema = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object({
    reason: Joi.string().trim().max(120).required(),
    details: Joi.string().trim().max(1000).required(),
  }),
};

const queryReportsSchema = {
  query: Joi.object({
    status: Joi.string().valid(...Object.values(REPORT_STATUSES)),
  }),
};

const updateReportStatusSchema = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object({
    status: Joi.string().valid(REPORT_STATUSES.REVIEWED, REPORT_STATUSES.DISMISSED).required(),
    resolutionNote: Joi.string().trim().max(500).allow('', null),
  }),
};

module.exports = {
  createTradeReportSchema,
  queryReportsSchema,
  updateReportStatusSchema,
};
