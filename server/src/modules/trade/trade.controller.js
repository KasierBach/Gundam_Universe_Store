const tradeService = require('./trade.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const ApiResponse = require('../../shared/utils/ApiResponse');

class TradeController {
  createListing = asyncHandler(async (req, res) => {
    const listing = await tradeService.createListing(req.body, req.user._id);
    res.status(201).json(ApiResponse.created(listing, 'Trade listing created successfully'));
  });

  queryListings = asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.condition) filter.condition = req.query.condition;
    if (req.query.owner) filter.owner = req.query.owner;

    const options = {
      sortBy: req.query.sortBy,
      order: req.query.order,
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
    };

    const results = await tradeService.queryListings(filter, options);
    res.status(200).json(ApiResponse.success(results, 'Listings fetched successfully'));
  });

  getMyOffers = asyncHandler(async (req, res) => {
    const offers = await tradeService.getUserOffers(req.user._id);
    res.status(200).json(ApiResponse.success(offers, 'Your trade offers fetched successfully'));
  });

  getListingById = asyncHandler(async (req, res) => {
    const listing = await tradeService.getListingById(req.params.id);
    res.status(200).json(ApiResponse.success(listing, 'Listing fetched successfully'));
  });

  createOffer = asyncHandler(async (req, res) => {
    const offer = await tradeService.createOffer(req.params.id, req.body, req.user._id);
    res.status(201).json(ApiResponse.created(offer, 'Offer sent successfully'));
  });

  acceptOffer = asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (status === 'accepted') {
      await tradeService.acceptOffer(req.params.id, req.params.offerId, req.user._id);
      res.status(200).json(ApiResponse.success(null, 'Offer accepted successfully'));
    } else {
      await tradeService.rejectOffer(req.params.id, req.params.offerId, req.user._id);
      res.status(200).json(ApiResponse.success(null, 'Offer rejected successfully'));
    }
  });

  getListingOffers = asyncHandler(async (req, res) => {
    const offers = await tradeService.getListingOffers(req.params.id, req.user._id);
    res.status(200).json(ApiResponse.success(offers, 'Offers fetched successfully'));
  });
}

module.exports = new TradeController();
