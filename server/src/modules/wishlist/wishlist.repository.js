const Wishlist = require('./wishlist.model');
const BaseRepository = require('../../shared/base/BaseRepository');

class WishlistRepository extends BaseRepository {
  constructor() {
    super(Wishlist);
  }

  async findByUserId(userId) {
    return this.model.findOne({ user: userId })
      .populate({
        path: 'products',
        populate: [
          { path: 'category', select: 'name slug' },
          { path: 'seller', select: 'displayName avatar reputation' },
        ],
      });
  }

  async upsertByUserId(userId) {
    return this.model.findOneAndUpdate(
      { user: userId },
      { $setOnInsert: { user: userId, products: [] } },
      { new: true, upsert: true }
    );
  }

  async addProduct(userId, productId) {
    return this.model.findOneAndUpdate(
      { user: userId },
      {
        $setOnInsert: { user: userId },
        $addToSet: { products: productId },
      },
      { new: true, upsert: true }
    );
  }

  async removeProduct(userId, productId) {
    return this.model.findOneAndUpdate(
      { user: userId },
      { $pull: { products: productId } },
      { new: true }
    );
  }

  async clearProducts(userId) {
    return this.model.findOneAndUpdate(
      { user: userId },
      { $set: { products: [] } },
      { new: true }
    );
  }
}

module.exports = new WishlistRepository();
