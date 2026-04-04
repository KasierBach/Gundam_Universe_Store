const cartService = require('./cart.service');
const BaseController = require('../../shared/base/BaseController');
const ApiResponse = require('../../shared/utils/ApiResponse');
const asyncHandler = require('../../shared/utils/asyncHandler');

class CartController extends BaseController {
  constructor() {
    super(cartService);
    // Bind specific handlers
    this.get = asyncHandler(this.get.bind(this));
    this.add = asyncHandler(this.add.bind(this));
    this.updateItem = asyncHandler(this.updateItem.bind(this));
    this.removeItem = asyncHandler(this.removeItem.bind(this));
    this.clearAll = asyncHandler(this.clearAll.bind(this));
  }

  /**
   * Get user's cart
   */
  async get(req, res) {
    const cart = await this.service.getCart(req.user._id);
    res.status(200).json(ApiResponse.success(cart, 'Cart retrieved successfully'));
  }

  /**
   * Add item to cart
   */
  async add(req, res) {
    const { productId, quantity } = req.body;
    const cart = await this.service.addItem(req.user._id, productId, quantity);
    res.status(200).json(ApiResponse.success(cart, 'Item added to cart'));
  }

  /**
   * Update item quantity
   */
  async updateItem(req, res) {
    const { productId, quantity } = req.body;
    const cart = await this.service.updateItem(req.user._id, productId, quantity);
    res.status(200).json(ApiResponse.success(cart, 'Cart updated successfully'));
  }

  /**
   * Remove item from cart
   */
  async removeItem(req, res) {
    const { productId } = req.params;
    const cart = await this.service.removeItem(req.user._id, productId);
    res.status(200).json(ApiResponse.success(cart, 'Item removed from cart'));
  }

  /**
   * Clear all items from cart
   */
  async clearAll(req, res) {
    const cart = await this.service.clearCart(req.user._id);
    res.status(200).json(ApiResponse.success(cart, 'Cart cleared successfully'));
  }
}

module.exports = new CartController();
