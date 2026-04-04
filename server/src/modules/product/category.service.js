const categoryRepository = require('./category.repository');
const BaseService = require('../../shared/base/BaseService');
const ApiError = require('../../shared/utils/ApiError');
const slugify = require('slugify');

class CategoryService extends BaseService {
  constructor() {
    super(categoryRepository);
  }

  /**
   * Create new category
   * @param {Object} data 
   * @returns {Promise<Object>}
   */
  async create(data) {
    // Check if name already exists
    if (await this.repository.existsByName(data.name)) {
      throw ApiError.badRequest('Category name already exists');
    }

    // Generate slug
    data.slug = slugify(data.name, { lower: true, strict: true });
    
    return this.repository.create(data);
  }

  /**
   * Update category
   * @param {string} id 
   * @param {Object} data 
   * @returns {Promise<Object>}
   */
  async update(id, data) {
    const category = await this.getById(id);
    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    // Check name uniqueness if changed
    if (data.name && data.name !== category.name) {
      if (await this.repository.existsByName(data.name, id)) {
        throw ApiError.badRequest('Category name already exists');
      }
      data.slug = slugify(data.name, { lower: true, strict: true });
    }

    return this.repository.update(id, data);
  }

  /**
   * Toggle category status
   * @param {string} id 
   * @returns {Promise<Object>}
   */
  async toggleStatus(id) {
    const category = await this.getById(id);
    if (!category) {
      throw ApiError.notFound('Category not found');
    }
    return this.repository.update(id, { isActive: !category.isActive });
  }

  /**
   * Get active categories
   */
  async getActiveCategories() {
    return this.repository.find({ isActive: true });
  }
}

module.exports = new CategoryService();
