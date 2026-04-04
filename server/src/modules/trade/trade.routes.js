const express = require('express');
const tradeController = require('./trade.controller');
const tradeValidator = require('./trade.validator');
const reportController = require('../report/report.controller');
const reportValidator = require('../report/report.validator');
const { validate } = require('../../shared/middlewares/validate.middleware');
const { authenticate } = require('../../shared/middlewares/auth.middleware');
const { uploadMultiple } = require('../../shared/middlewares/upload.middleware');
const { normalizeMultipartFields } = require('../../shared/middlewares/multipart.middleware');

const router = express.Router();

/**
 * Trade Listing Routes
 */
router.get('/offers/me', authenticate, tradeController.getMyOffers);

router.route('/')
  .post(
    authenticate,
    uploadMultiple,
    normalizeMultipartFields(['images']),
    validate(tradeValidator.createListingSchema),
    tradeController.createListing
  )
  .get(validate(tradeValidator.queryListingSchema), tradeController.queryListings);

router.route('/:id')
  .get(tradeController.getListingById);

router.post(
  '/:id/report',
  authenticate,
  validate(reportValidator.createTradeReportSchema),
  reportController.createTradeListingReport
);

/**
 * Trade Offer Routes
 */
router.route('/:id/offers')
  .post(
    authenticate,
    uploadMultiple,
    normalizeMultipartFields(['images']),
    validate(tradeValidator.createOfferSchema),
    tradeController.createOffer
  )
  .get(authenticate, tradeController.getListingOffers);

router.route('/:id/offers/:offerId/status')
  .patch(authenticate, validate(tradeValidator.updateOfferStatusSchema), tradeController.acceptOffer);

module.exports = router;
