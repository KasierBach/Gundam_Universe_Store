const mongoose = require('mongoose');
const { PRODUCT_CONDITIONS } = require('../../shared/constants/productConstants');
const { TRADE_LISTING_STATUS } = require('../../shared/constants/tradeStatus');

const tradeListingSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    wantedItems: {
      type: String,
      required: [true, 'Description of wanted items is required'],
      trim: true,
      maxlength: [500, 'Wanted items description cannot exceed 500 characters'],
    },
    condition: {
      type: String,
      enum: Object.values(PRODUCT_CONDITIONS),
      required: [true, 'Item condition is required'],
    },
    status: {
      type: String,
      enum: Object.values(TRADE_LISTING_STATUS),
      default: TRADE_LISTING_STATUS.OPEN,
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
tradeListingSchema.index({ status: 1, createdAt: -1 });
tradeListingSchema.index({ owner: 1 });

const TradeListing = mongoose.model('TradeListing', tradeListingSchema);

module.exports = TradeListing;
