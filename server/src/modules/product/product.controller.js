const productService = require('./product.service');
const BaseController = require('../../shared/base/BaseController');
const ApiResponse = require('../../shared/utils/ApiResponse');
const asyncHandler = require('../../shared/utils/asyncHandler');

class ProductController extends BaseController {
  constructor() {
    super(productService);
    // Bind specific handlers
    this.create = asyncHandler(this.create.bind(this));
    this.update = asyncHandler(this.update.bind(this));
    this.delete = asyncHandler(this.delete.bind(this));
    this.query = asyncHandler(this.query.bind(this));
    this.getBySlug = asyncHandler(this.getBySlug.bind(this));
    this.getRecommendations = asyncHandler(this.getRecommendations.bind(this));
  }

  /**
   * Create product
   */
  async create(req, res) {
    const data = req.body;
    const product = await this.service.create(data, req.user._id);
    res.status(201).json(ApiResponse.success(product, 'Product created successfully'));
  }

  /**
   * Update product
   */
  async update(req, res) {
    const { id } = req.params;
    const data = req.body;
    const product = await this.service.update(id, data, req.user._id, req.user.role);
    res.status(200).json(ApiResponse.success(product, 'Product updated successfully'));
  }

  /**
   * Delete product
   */
  async delete(req, res) {
    const { id } = req.params;
    await this.service.delete(id, req.user._id, req.user.role);
    res.status(200).json(ApiResponse.success(null, 'Product deleted successfully'));
  }

  /**
   * Advanced query products
   */
  async query(req, res) {
    const products = await this.service.queryProducts(req.query);
    res.status(200).json(ApiResponse.success(products, 'Products retrieved successfully'));
  }

  /**
   * Get product by slug
   */
  async getBySlug(req, res) {
    const { slug } = req.params;
    const product = await this.service.getBySlug(slug);
    res.status(200).json(ApiResponse.success(product, 'Product details retrieved successfully'));
  }

  async getRecommendations(req, res) {
    const { slug } = req.params;
    const recommendations = await this.service.getRecommendationsBySlug(slug, Number(req.query.limit) || 4);
    res.status(200).json(ApiResponse.success(recommendations, 'Product recommendations retrieved successfully'));
  }
}

module.exports = new ProductController();
