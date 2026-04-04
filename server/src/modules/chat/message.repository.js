const Message = require('./message.model');
const BaseRepository = require('../../shared/base/BaseRepository');

class MessageRepository extends BaseRepository {
  constructor() {
    super(Message);
  }

  async findByConversation(conversationId, options = {}) {
    const { limit = 50, skip = 0 } = options;
    return this.model.find({ conversation: conversationId })
      .populate('sender', 'displayName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async markAsRead(conversationId, userId) {
    return this.model.updateMany(
      { conversation: conversationId, sender: { $ne: userId }, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } }
    );
  }
}

module.exports = new MessageRepository();
