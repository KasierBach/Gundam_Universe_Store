const orderService = require('./order.service');
const BaseController = require('../../shared/base/BaseController');
const ApiResponse = require('../../shared/utils/ApiResponse');
const asyncHandler = require('../../shared/utils/asyncHandler');
const ApiError = require('../../shared/utils/ApiError');

class OrderController extends BaseController {
  constructor() {
    super(orderService);
    // Bind specific handlers
    this.create = asyncHandler(this.create.bind(this));
    this.getHistory = asyncHandler(this.getHistory.bind(this));
    this.getById = asyncHandler(this.getById.bind(this));
    this.updateStatus = asyncHandler(this.updateStatus.bind(this));
  }

  /**
   * Checkout: Create order from current cart
   */
  async create(req, res) {
    const { shippingAddress, paymentMethod, notes } = req.body;
    const order = await this.service.createOrder(req.user._id, {
      shippingAddress,
      paymentMethod,
      notes
    });
    res.status(201).json(ApiResponse.success(order, 'Order created successfully. Mission logs updated.'));
  }

  /**
   * Get mission logs (order history) for current pilot
   */
  async getHistory(req, res) {
    const orders = await this.service.getPilotMissionLogs(req.user._id);
    res.status(200).json(ApiResponse.success(orders, 'Mission logs retrieved successfully'));
  }

  /**
   * Get specific order detail
   */
  async getById(req, res) {
    const { id } = req.params;
    const order = await this.service.getById(id);
    // Secure: Only the owner or Admin can see order details
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
       throw ApiError.forbidden('You do not have permission to view this mission log');
    }
    res.status(200).json(ApiResponse.success(order, 'Order details retrieved successfully'));
  }

  /**
   * Admin: Update order status
   */
  async updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    const order = await this.service.updateStatus(id, status);
    res.status(200).json(ApiResponse.success(order, 'Order status updated successfully'));
  }
}

module.exports = new OrderController();
