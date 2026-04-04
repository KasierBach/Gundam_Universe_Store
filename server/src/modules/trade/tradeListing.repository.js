const TradeListing = require('./tradeListing.model');
const BaseRepository = require('../../shared/base/BaseRepository');

class TradeListingRepository extends BaseRepository {
  constructor() {
    super(TradeListing);
  }

  async findFiltered(filter, options) {
    const { sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const query = this.model.find(filter)
      .populate('owner', 'displayName avatar reputation')
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);

    const results = await query.exec();
    const total = await this.model.countDocuments(filter);

    return {
      results,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
    };
  }

  async incrementViews(id) {
    return this.model.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
  }

  async findWithDetails(id) {
    return this.model.findById(id).populate('owner', 'displayName avatar reputation phone email');
  }
}

module.exports = new TradeListingRepository();
