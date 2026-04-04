const Cart = require('./cart.model');
const BaseRepository = require('../../shared/base/BaseRepository');

class CartRepository extends BaseRepository {
  constructor() {
    super(Cart);
  }

  /**
   * Find cart by user ID and populate products
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  async findByUserId(userId) {
    return this.model.findOne({ user: userId })
      .populate('items.product', 'name price images stock grade series condition rarity slug');
  }

  /**
   * Add or update item in cart
   * @param {string} userId 
   * @param {string} productId 
   * @param {number} quantity 
   * @returns {Promise<Object>}
   */
  async updateItem(userId, productId, quantity) {
    // Note: This is an atomic update to prevent race conditions
    // If quantity is 0 or less, it should be handled in service layer
    const cart = await this.model.findOneAndUpdate(
      { user: userId },
      { $set: { "items.$[elem].quantity": quantity } },
      { 
        arrayFilters: [{ "elem.product": productId }],
        new: true,
        runValidators: true
      }
    );
    return cart;
  }

  /**
   * Remove item from cart
   * @param {string} userId 
   * @param {string} productId 
   * @returns {Promise<Object>}
   */
  async removeItem(userId, productId) {
    return this.model.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { product: productId } } },
      { new: true }
    );
  }

  /**
   * Clear all items from cart
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  async clearCart(userId) {
    return this.model.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } },
      { new: true }
    );
  }
}

module.exports = new CartRepository();
