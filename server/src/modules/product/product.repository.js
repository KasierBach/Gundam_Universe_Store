const Product = require('./product.model');
const BaseRepository = require('../../shared/base/BaseRepository');

class ProductRepository extends BaseRepository {
  constructor() {
    super(Product);
  }

  /**
   * Find products with advanced filters and pagination
   * @param {Object} filter 
   * @param {Object} options 
   */
  async findFiltered(filter, options) {
    const { sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const query = this.model.find(filter)
      .populate('category', 'name slug')
      .populate('seller', 'displayName avatar')
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);

    const products = await query.exec();
    const total = await this.model.countDocuments(filter);

    return {
      results: products,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
    };
  }

  /**
   * Find product by slug with full details
   * @param {string} slug 
   */
  async findBySlug(slug) {
    return this.model.findOne({ slug })
      .populate('category', 'name slug')
      .populate('seller', 'displayName avatar phone reputation');
  }

  async findRelatedProducts(product, limit = 4) {
    const orFilters = [
      { category: product.category },
      { grade: product.grade },
      { series: product.series },
    ];

    if (product.rarity) {
      orFilters.push({ rarity: product.rarity });
    }

    return this.model.find({
      _id: { $ne: product._id },
      status: 'active',
      $or: orFilters,
    })
      .populate('category', 'name slug')
      .populate('seller', 'displayName avatar')
      .sort({ views: -1, 'ratings.average': -1, createdAt: -1 })
      .limit(limit);
  }

  /**
   * Increment view count
   * @param {string} id 
   */
  async incrementViews(id) {
    return this.model.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
  }
}

module.exports = new ProductRepository();
