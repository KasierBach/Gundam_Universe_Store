const cartRepository = require('./cart.repository');
const BaseService = require('../../shared/base/BaseService');
const ApiError = require('../../shared/utils/ApiError');

class CartService extends BaseService {
  constructor() {
    super(cartRepository);
  }

  /**
   * Get user's cart or create one if it doesn't exist
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  async getCart(userId) {
    let cart = await this.repository.findByUserId(userId);
    if (!cart) {
      cart = await this.repository.create({ user: userId, items: [] });
    } else {
      // Clean up any null products (e.g. from deleted products after seed)
      const originalCount = cart.items.length;
      cart.items = cart.items.filter(item => item.product !== null);
      if (cart.items.length !== originalCount) {
        await cart.save();
      }
    }
    return cart;
  }

  /**
   * Add item to cart
   * @param {string} userId 
   * @param {string} productId 
   * @param {number} quantity 
   * @returns {Promise<Object>}
   */
  async addItem(userId, productId, quantity = 1) {
    const cart = await this.getCart(userId);
    
    // Clean up any null products (e.g. from deleted products after seed)
    cart.items = cart.items.filter(item => item.product !== null);
    
    const existingItemIndex = cart.items.findIndex(
      item => (item.product && (item.product._id?.toString() === productId.toString() || item.product.toString() === productId.toString()))
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    return this.getCart(userId); // Return populated cart
  }

  /**
   * Update item quantity
   * @param {string} userId 
   * @param {string} productId 
   * @param {number} quantity 
   * @returns {Promise<Object>}
   */
  async updateItem(userId, productId, quantity) {
    if (quantity <= 0) {
      return this.removeItem(userId, productId);
    }

    const cart = await this.repository.updateItem(userId, productId, quantity);
    if (!cart) throw ApiError.notFound('Cart or item not found');
    
    return this.getCart(userId);
  }

  /**
   * Remove item from cart
   * @param {string} userId 
   * @param {string} productId 
   * @returns {Promise<Object>}
   */
  async removeItem(userId, productId) {
    const cart = await this.repository.removeItem(userId, productId);
    if (!cart) throw ApiError.notFound('Cart not found');
    
    return this.getCart(userId);
  }

  /**
   * Clear cart
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  async clearCart(userId) {
    const cart = await this.repository.clearCart(userId);
    if (!cart) throw ApiError.notFound('Cart not found');
    return cart;
  }
}

module.exports = new CartService();
