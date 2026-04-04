const wishlistRepository = require('./wishlist.repository');
const productRepository = require('../product/product.repository');
const ApiError = require('../../shared/utils/ApiError');

class WishlistService {
  async getWishlist(userId) {
    let wishlist = await wishlistRepository.findByUserId(userId);
    if (!wishlist) {
      wishlist = await wishlistRepository.upsertByUserId(userId);
      wishlist = await wishlistRepository.findByUserId(userId);
    }

    wishlist.products = (wishlist.products || []).filter(Boolean);
    if (wishlist.products.length === 0) {
      return wishlist;
    }

    return wishlist;
  }

  async addProduct(userId, productId) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    await wishlistRepository.addProduct(userId, productId);
    return this.getWishlist(userId);
  }

  async removeProduct(userId, productId) {
    await wishlistRepository.removeProduct(userId, productId);
    return this.getWishlist(userId);
  }

  async clearWishlist(userId) {
    await wishlistRepository.clearProducts(userId);
    return this.getWishlist(userId);
  }
}

module.exports = new WishlistService();
