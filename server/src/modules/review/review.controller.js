const reviewService = require('./review.service');
const BaseController = require('../../shared/base/BaseController');
const ApiResponse = require('../../shared/utils/ApiResponse');
const asyncHandler = require('../../shared/utils/asyncHandler');

class ReviewController extends BaseController {
  constructor() {
    super(reviewService);
    // Bind specific handlers
    this.create = asyncHandler(this.create.bind(this));
    this.getByProduct = asyncHandler(this.getByProduct.bind(this));
    this.remove = asyncHandler(this.remove.bind(this));
  }

  /**
   * Submit a new review
   */
  async create(req, res) {
    const { productId, rating, comment } = req.body;
    const review = await this.service.createReview(req.user._id, productId, { rating, comment });
    res.status(201).json(ApiResponse.success(review, 'Mission report submitted successfully. Reputation updated.'));
  }

  /**
   * Get all reviews for a product
   */
  async getByProduct(req, res) {
    const { productId } = req.params;
    const reviews = await this.service.getProductReviews(productId);
    res.status(200).json(ApiResponse.success(reviews, 'Mission reports retrieved successfully'));
  }

  /**
   * Delete a review
   */
  async remove(req, res) {
    const { id } = req.params;
    await this.service.deleteReview(id, req.user._id, req.user.role);
    res.status(200).json(ApiResponse.success(null, 'Mission report deleted successfully'));
  }
}

module.exports = new ReviewController();
