const mongoose = require('mongoose');
const Review = require('./review.model');
const BaseRepository = require('../../shared/base/BaseRepository');

class ReviewRepository extends BaseRepository {
  constructor() {
    super(Review);
  }

  /**
   * Find reviews for a specific product
   * @param {string} productId 
   * @returns {Promise<Array>}
   */
  async findByProductId(productId) {
    return this.model.find({ product: productId })
      .populate('user', 'displayName avatar')
      .sort({ createdAt: -1 });
  }

  /**
   * Check if user already reviewed a product
   * @param {string} userId 
   * @param {string} productId 
   */
  async exists(userId, productId) {
    return this.model.exists({ user: userId, product: productId });
  }

  /**
   * Get average rating and count for a product
   * @param {string} productId 
   */
  async getStats(productId) {
    const stats = await this.model.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: '$product',
          avgRating: { $avg: '$rating' },
          counts: { $sum: 1 }
        }
      }
    ]);
    return stats[0] || { avgRating: 0, counts: 0 };
  }
}

module.exports = new ReviewRepository();
