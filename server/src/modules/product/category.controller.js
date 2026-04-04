const categoryService = require('./category.service');
const BaseController = require('../../shared/base/BaseController');
const ApiResponse = require('../../shared/utils/ApiResponse');
const asyncHandler = require('../../shared/utils/asyncHandler');

class CategoryController extends BaseController {
  constructor() {
    super(categoryService);
    // Bind specific handlers
    this.create = asyncHandler(this.create.bind(this));
    this.update = asyncHandler(this.update.bind(this));
    this.toggleStatus = asyncHandler(this.toggleStatus.bind(this));
    this.getActive = asyncHandler(this.getActive.bind(this));
    this.getAll = asyncHandler(this.getAll.bind(this));
  }

  /**
   * Create category
   */
  async create(req, res) {
    const data = req.body;
    const category = await this.service.create(data);
    res.status(201).json(ApiResponse.success(category, 'Category created successfully'));
  }

  /**
   * Update category
   */
  async update(req, res) {
    const { id } = req.params;
    const data = req.body;
    const category = await this.service.update(id, data);
    res.status(200).json(ApiResponse.success(category, 'Category updated successfully'));
  }

  /**
   * Toggle category status
   */
  async toggleStatus(req, res) {
    const { id } = req.params;
    const category = await this.service.toggleStatus(id);
    res.status(200).json(ApiResponse.success(category, 'Category status toggled successfully'));
  }

  /**
   * Get active categories
   */
  async getActive(req, res) {
    const categories = await this.service.getActiveCategories();
    res.status(200).json(ApiResponse.success(categories, 'Active categories retrieved successfully'));
  }

  /**
   * Get all categories (Admin/Seller)
   */
  async getAll(req, res) {
    const categories = await this.service.getAll();
    res.status(200).json(ApiResponse.success(categories, 'All categories retrieved successfully'));
  }
}

module.exports = new CategoryController();
