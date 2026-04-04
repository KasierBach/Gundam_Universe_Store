const mongoose = require('mongoose');
const { TRADE_OFFER_STATUS } = require('../../shared/constants/tradeStatus');

const tradeOfferSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TradeListing',
      required: [true, 'Listing reference is required'],
    },
    offerer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Offerer is required'],
    },
    offeredItemsDescription: {
      type: String,
      required: [true, 'Description of offered items is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: Object.values(TRADE_OFFER_STATUS),
      default: TRADE_OFFER_STATUS.PENDING,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
tradeOfferSchema.index({ listing: 1 });
tradeOfferSchema.index({ offerer: 1 });

const TradeOffer = mongoose.model('TradeOffer', tradeOfferSchema);

module.exports = TradeOffer;
