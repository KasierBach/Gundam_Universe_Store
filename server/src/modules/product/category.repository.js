const Category = require('./category.model');
const BaseRepository = require('../../shared/base/BaseRepository');

class CategoryRepository extends BaseRepository {
  constructor() {
    super(Category);
  }

  /**
   * Find category by slug
   * @param {string} slug 
   */
  async findBySlug(slug) {
    return this.model.findOne({ slug });
  }

  /**
   * Check if category name exists
   * @param {string} name 
   * @param {string} [excludeId]
   */
  async existsByName(name, excludeId = null) {
    const query = { name: new RegExp(`^${name}$`, 'i') };
    if (excludeId) query._id = { $ne: excludeId };
    return !!(await this.model.findOne(query));
  }
}

module.exports = new CategoryRepository();
