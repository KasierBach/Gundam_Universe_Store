const orderRepository = require('./order.repository');
const cartService = require('../cart/cart.service');
const productRepository = require('../product/product.repository');
const BaseService = require('../../shared/base/BaseService');
const ApiError = require('../../shared/utils/ApiError');
const mongoose = require('mongoose');

class OrderService extends BaseService {
  constructor() {
    super(orderRepository);
  }

  /**
   * Create new order from cart (Checkout)
   * @param {string} userId 
   * @param {Object} shippingData { shippingAddress, paymentMethod, notes }
   * @returns {Promise<Object>}
   */
  async createOrder(userId, shippingData) {
    const { shippingAddress, paymentMethod, notes } = shippingData;
    
    // 1. Get populated cart
    const cart = await cartService.getCart(userId);
    if (!cart || cart.items.length === 0) {
      throw ApiError.badRequest('Cannot checkout with an empty cart');
    }

    // 2. Validate stock and prepare order items
    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = item.product;
      
      // Double check stock
      if (product.stock < item.quantity) {
        throw ApiError.badRequest(`Insufficient stock for unit: ${product.name}. Available: ${product.stock}`);
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0]?.url || '',
        grade: product.grade,
        series: product.series,
        condition: product.condition,
      });

      totalAmount += product.price * item.quantity;
    }

    // 3. Create Order & Update Stock (In a real production app, use Mongoose Session/Transaction)
    // For simplicity, we'll use sequential updates
    
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      // Create Order
      const order = await this.repository.create([{
        user: userId,
        items: orderItems,
        totalAmount,
        shippingAddress,
        paymentInfo: { method: paymentMethod || 'COD' },
        notes,
      }], { session });

      // Atomically deduct stock
      for (const item of orderItems) {
        const updatedProduct = await productRepository.model.findOneAndUpdate(
          { _id: item.product, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { session, new: true }
        );
        
        if (!updatedProduct) {
          throw new Error(`Stock conflict for ${item.name}. Deployment aborted.`);
        }
      }

      await session.commitTransaction();
      await cartService.clearCart(userId);
      return order[0];
    } catch (error) {
      await session.abortTransaction();
      throw ApiError.badRequest(error.message || 'Transaction failed');
    } finally {
      session.endSession();
    }
  }

  /**
   * Get total order history for a pilot
   * @param {string} userId 
   */
  async getPilotMissionLogs(userId) {
    return this.repository.findByUserId(userId);
  }

  async getById(orderId) {
    const order = await this.repository.findDetailById(orderId);
    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    return order;
  }

  /**
   * Admin: Update order status
   */
  async updateStatus(orderId, status) {
    const order = await this.repository.updateStatus(orderId, status);
    if (!order) throw ApiError.notFound('Order not found');
    return order;
  }
}

module.exports = new OrderService();
