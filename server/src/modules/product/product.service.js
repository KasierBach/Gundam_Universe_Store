const productRepository = require('./product.repository');
const BaseService = require('../../shared/base/BaseService');
const ApiError = require('../../shared/utils/ApiError');
const slugify = require('slugify');
const { uploadFilesToCloudinary, destroyManagedAssets } = require('../../shared/utils/cloudinaryAsset');

class ProductService extends BaseService {
  constructor() {
    super(productRepository);
  }

  /**
   * Create new product
   * @param {Object} data 
   * @param {string} sellerId 
   */
  async create(data, sellerId, files = []) {
    const images = await this._resolveProductImages(data.images, files);

    data.seller = sellerId;
    data.slug = this._generateSlug(data.name);
    data.images = images;
    return this.repository.create(data);
  }

  /**
   * Update product
   * @param {string} id 
   * @param {Object} data 
   * @param {string} userId 
   * @param {string} role 
   */
  async update(id, data, userId, role, files = []) {
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

    if (files.length > 0 || Array.isArray(data.images)) {
      data.images = await this._resolveProductImages(data.images, files);

      const incomingPublicIds = new Set((data.images || []).map((image) => image.publicId));
      const staleImages = (product.images || []).filter((image) => !incomingPublicIds.has(image.publicId));
      await destroyManagedAssets(staleImages);
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

    await destroyManagedAssets(product.images || []);
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

    const serializedProduct = product.toObject ? product.toObject() : product;
    return {
      ...serializedProduct,
      marketIntel: this._estimateMarketIntel(serializedProduct),
    };
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

  async _resolveProductImages(existingImages = [], files = []) {
    const normalizedImages = Array.isArray(existingImages) ? existingImages : [];
    const uploadedImages = files.length > 0
      ? await uploadFilesToCloudinary(files, {
        folder: 'gundam-universe/products',
      })
      : [];

    const resolvedImages = uploadedImages.length > 0 ? uploadedImages : normalizedImages;

    if (!resolvedImages.length) {
      throw ApiError.badRequest('At least one product image is required');
    }

    return resolvedImages.map((image, index) => ({
      url: image.url,
      publicId: image.publicId,
      isMain: index === 0,
    }));
  }

  _estimateMarketIntel(product) {
    const rarityMultipliers = {
      Common: 0.95,
      Rare: 1.15,
      'Super Rare': 1.28,
      'Ultra Rare': 1.4,
      Legendary: 1.58,
    };

    const conditionMultipliers = {
      'New (MISB)': 1.08,
      'Mint (BIB)': 1,
      'Used / Pre-owned': 0.88,
      'Damaged / Parts only': 0.55,
    };

    const rarityBoost = rarityMultipliers[product.rarity] || 1;
    const conditionBoost = conditionMultipliers[product.condition] || 1;
    const viewBoost = Math.min(1.12, 1 + ((product.views || 0) / 5000));
    const ratingBoost = 1 + (((product.ratings?.average || 0) - 3) * 0.04);

    const estimatedValue = Math.round(product.price * rarityBoost * conditionBoost * viewBoost * ratingBoost);
    const minValue = Math.round(estimatedValue * 0.92);
    const maxValue = Math.round(estimatedValue * 1.11);
    const confidence = product.ratings?.count > 0 ? 'medium' : 'low';

    return {
      estimatedValue,
      valueBand: { min: minValue, max: maxValue },
      confidence,
      signals: [
        `rarity:${product.rarity}`,
        `condition:${product.condition}`,
        `views:${product.views || 0}`,
        `rating:${product.ratings?.average || 0}`,
      ],
    };
  }
}

module.exports = new ProductService();
