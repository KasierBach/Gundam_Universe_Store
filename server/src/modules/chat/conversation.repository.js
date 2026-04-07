const Conversation = require('./conversation.model');
const BaseRepository = require('../../shared/base/BaseRepository');

class ConversationRepository extends BaseRepository {
  constructor() {
    super(Conversation);
  }

  async findByParticipants(participantIds) {
    return this.model.findOne({
      participants: { $all: participantIds, $size: participantIds.length }
    }).populate('participants', 'displayName avatar');
  }

  async findDirectConversation(participantIds) {
    return this.model.findOne({
      kind: 'direct',
      participants: { $all: participantIds, $size: participantIds.length },
    })
      .populate('participants', 'displayName avatar')
      .populate('relatedProduct', 'name slug images')
      .populate('relatedTradeListing', 'title');
  }

  async findDetailedById(conversationId) {
    return this.model.findById(conversationId)
      .populate('participants', 'displayName avatar role reputation address')
      .populate('relatedOffer')
      .populate('relatedProduct', 'name slug images')
      .populate('relatedTradeListing', 'title')
      .populate('lastMessage');
  }

  async findUserConversations(userId) {
    return this.model.find({
      participants: userId
    })
    .populate('participants', 'displayName avatar')
    .populate('relatedOffer')
    .populate('relatedProduct', 'name slug images')
    .populate('relatedTradeListing', 'title')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });
  }

  async updateLastMessage(conversationId, messageId) {
    return this.model.findByIdAndUpdate(conversationId, {
      lastMessage: messageId
    }, { new: true });
  }
}

module.exports = new ConversationRepository();
