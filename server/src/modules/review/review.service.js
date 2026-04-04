const reviewRepository = require('./review.repository');
const productRepository = require('../product/product.repository');
const BaseService = require('../../shared/base/BaseService');
const ApiError = require('../../shared/utils/ApiError');
class ReviewService extends BaseService {
  constructor() {
    super(reviewRepository);
  }

  /**
   * Add a new review for a product from a pilot
   * @param {string} userId 
   * @param {string} productId 
   * @param {Object} reviewData { rating, comment }
   * @returns {Promise<Object>}
   */
  async createReview(userId, productId, reviewData) {
    const { rating, comment } = reviewData;
    
    // 1. Check if pilot already reviewed this unit
    if (await this.repository.exists(userId, productId)) {
      throw ApiError.badRequest('You have already submitted a review for this unit.');
    }

    // 2. Create review
    const review = await this.repository.create({
      user: userId,
      product: productId,
      rating,
      comment
    });

    // 3. Re-calculate and update product overall stats
    const stats = await this.repository.getStats(productId);
    await productRepository.updateById(productId, {
      ratings: {
        average: Math.round(stats.avgRating * 10) / 10,
        count: stats.counts,
      },
    });

    return review;
  }

  /**
   * Get mission reports (reviews) for a specific unit
   */
  async getProductReviews(productId) {
    return this.repository.findByProductId(productId);
  }

  /**
   * Delete review (Owner or Admin only)
   */
  async deleteReview(reviewId, userId, role) {
    const review = await this.repository.findById(reviewId);
    if (!review) throw ApiError.notFound('Mission report not found');

    if (review.user.toString() !== userId && role !== 'admin') {
      throw ApiError.forbidden('You are not authorized to delete this mission report');
    }

    await this.repository.deleteById(reviewId);

    // Update product stats again
    const stats = await this.repository.getStats(review.product);
    await productRepository.updateById(review.product, {
      ratings: {
        average: Math.round(stats.avgRating * 10) / 10,
        count: stats.counts,
      },
    });
  }
}

module.exports = new ReviewService();
