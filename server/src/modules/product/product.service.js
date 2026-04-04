const productRepository = require('./product.repository');
const BaseService = require('../../shared/base/BaseService');
const ApiError = require('../../shared/utils/ApiError');
const slugify = require('slugify');

class ProductService extends BaseService {
  constructor() {
    super(productRepository);
  }

  /**
   * Create new product
   * @param {Object} data 
   * @param {string} sellerId 
   */
  async create(data, sellerId) {
    data.seller = sellerId;
    data.slug = this._generateSlug(data.name);
    return this.repository.create(data);
  }

  /**
   * Update product
   * @param {string} id 
   * @param {Object} data 
   * @param {string} userId 
   * @param {string} role 
   */
  async update(id, data, userId, role) {
    const product = await this.getById(id);
    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    // Check ownership if not admin
    if (role !== 'admin' && product.seller.toString() !== userId) {
      throw ApiError.forbidden('You are not authorized to update this product');
    }

    if (data.name && data.name !== product.name) {
      data.slug = this._generateSlug(data.name);
    }

    return this.repository.update(id, data);
  }

  /**
   * Delete product
   * @param {string} id 
   * @param {string} userId 
   * @param {string} role 
   */
  async delete(id, userId, role) {
    const product = await this.getById(id);
    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    // Check ownership if not admin
    if (role !== 'admin' && product.seller.toString() !== userId) {
      throw ApiError.forbidden('You are not authorized to delete this product');
    }

    return this.repository.delete(id);
  }

  /**
   * Advanced query products
   * @param {Object} query 
   */
  async queryProducts(query) {
    const filter = {};

    // Basic filters
    if (query.status) filter.status = query.status;
    else filter.status = 'active';

    if (query.category) filter.category = query.category;
    if (query.grade) filter.grade = query.grade;
    if (query.series) filter.series = new RegExp(query.series, 'i');
    if (query.rarity) filter.rarity = query.rarity;
    if (query.condition) filter.condition = query.condition;

    // Price range
    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = Number(query.minPrice);
      if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
    }

    // Text search
    if (query.name) {
      filter.$text = { $search: query.name };
    }

    const options = {
      sortBy: query.sortBy || 'createdAt',
      order: query.order || 'desc',
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
    };

    return this.repository.findFiltered(filter, options);
  }

  /**
   * Get product by slug
   * @param {string} slug 
   */
  async getBySlug(slug) {
    const product = await this.repository.findBySlug(slug);
    if (!product) {
      throw ApiError.notFound('Product not found');
    }
    // Increment views async
    this.repository.incrementViews(product._id);
    return product;
  }

  async getRecommendationsBySlug(slug, limit = 4) {
    const product = await this.repository.findBySlug(slug);
    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    return this.repository.findRelatedProducts(product, limit);
  }

  /**
   * Internal slufigy helper
   * @param {string} name 
   */
  _generateSlug(name) {
    return slugify(name, { lower: true, strict: true }) + '-' + Date.now();
  }
}

module.exports = new ProductService();
