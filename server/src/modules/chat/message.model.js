const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema(
  {
    kind: {
      type: String,
      enum: ['image', 'video', 'audio'],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      trim: true,
      default: '',
    },
    bytes: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: null,
    },
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      trim: true,
      default: '',
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'video', 'audio', 'mixed'],
      default: 'text',
    },
    attachments: {
      type: [attachmentSchema],
      default: [],
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

messageSchema.path('text').validate(function validateMessageText(value) {
  return Boolean((value && value.trim()) || this.attachments?.length);
}, 'Message text or attachments are required');

// Index for getting conversation history efficiently
messageSchema.index({ conversation: 1, createdAt: 1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
