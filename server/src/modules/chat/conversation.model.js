const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    kind: {
      type: String,
      enum: ['direct', 'trade_offer'],
      default: 'direct',
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    relatedOffer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TradeOffer',
      default: null,
    },
    relatedProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    relatedTradeListing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TradeListing',
      default: null,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
conversationSchema.index({ participants: 1 });
conversationSchema.index({ kind: 1, participants: 1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
