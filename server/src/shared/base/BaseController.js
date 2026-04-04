const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Base Controller - Abstract HTTP handler layer
 * Provides common CRUD endpoint handlers that can be inherited
 */
class BaseController {
  constructor(service) {
    this.service = service;
    // Bind common handlers to 'this' context
    this.getAll = asyncHandler(this.getAll.bind(this));
    this.getById = asyncHandler(this.getById.bind(this));
    this.delete = asyncHandler(this.delete.bind(this));
  }

  /**
   * Create a wrapped handler using asyncHandler
   * @param {Function} fn - Controller method
   * @returns {Function} Express middleware
   */
  handler(fn) {
    return asyncHandler(fn.bind(this));
  }

  // Common CRUD Handlers
  async getAll(req, res) {
    const data = await this.service.getAll(req.query.filter, req.query);
    res.json(ApiResponse.success(data));
  }

  async getById(req, res) {
    const data = await this.service.getById(req.params.id);
    res.json(ApiResponse.success(data));
  }

  async delete(req, res) {
    await this.service.delete(req.params.id);
    res.json(ApiResponse.success(null, 'Resource deleted successfully'));
  }
}

module.exports = BaseController;
