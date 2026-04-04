const TradeOffer = require('./tradeOffer.model');
const BaseRepository = require('../../shared/base/BaseRepository');

class TradeOfferRepository extends BaseRepository {
  constructor() {
    super(TradeOffer);
  }

  async findByListingId(listingId) {
    return this.model.find({ listing: listingId })
      .populate('offerer', 'displayName avatar reputation')
      .sort({ createdAt: -1 });
  }

  async findByOffererId(offererId) {
    return this.model.find({ offerer: offererId })
      .populate({
        path: 'listing',
        populate: {
          path: 'owner',
          select: 'displayName avatar reputation',
        },
      })
      .sort({ createdAt: -1 });
  }

  async findWithDetails(id) {
    return this.model.findById(id)
      .populate('offerer', 'displayName avatar reputation')
      .populate('listing');
  }

  async updateManyStatus(filter, updateData) {
    return this.model.updateMany(filter, updateData);
  }
}

module.exports = new TradeOfferRepository();
