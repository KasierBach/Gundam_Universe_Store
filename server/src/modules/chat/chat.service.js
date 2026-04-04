const conversationRepository = require('./conversation.repository');
const messageRepository = require('./message.repository');
const notificationService = require('../notification/notification.service');
const ApiError = require('../../shared/utils/ApiError');
const { getIO } = require('../../config/socket');

class ChatService {
  /**
   * Send a message in a conversation
   */
  async sendMessage(conversationId, senderId, text) {
    const conversation = await conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new ApiError(404, 'Conversation not found');
    }

    if (!conversation.participants.some(p => p.toString() === senderId.toString())) {
      throw new ApiError(403, 'You are not a participant in this conversation');
    }

    const message = await messageRepository.create({
      conversation: conversationId,
      sender: senderId,
      text,
      readBy: [senderId],
    });

    await conversationRepository.updateLastMessage(conversationId, message._id);

    const populatedMessage = await message.populate('sender', 'displayName avatar');

    // Emit socket event to the conversation room
    const io = getIO();
    io.to(conversationId.toString()).emit('receive_message', populatedMessage);

    // Also emit a notification to the other participant's personal room
    const otherParticipantId = conversation.participants.find(p => p.toString() !== senderId.toString());
    if (otherParticipantId) {
      await notificationService.createNotification({
        user: otherParticipantId,
        type: notificationService.constructor.NOTIFICATION_TYPES
          ? notificationService.constructor.NOTIFICATION_TYPES.CHAT_MESSAGE
          : 'chat_message',
        title: 'New communication signal',
        message: populatedMessage.text.substring(0, 80),
        link: `/chat?conversation=${conversationId}`,
        metadata: {
          conversationId,
          senderId,
        },
      });

      io.to(otherParticipantId.toString()).emit('new_message_notification', {
        conversationId,
        sender: populatedMessage.sender.displayName,
        text: populatedMessage.text.substring(0, 50) + (populatedMessage.text.length > 50 ? '...' : ''),
      });
    }

    return populatedMessage;
  }

  /**
   * Get all conversations for a user
   */
  async getUserConversations(userId) {
    return conversationRepository.findUserConversations(userId);
  }

  /**
   * Get messages in a conversation
   */
  async getConversationMessages(conversationId, userId, options) {
    const conversation = await conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new ApiError(404, 'Conversation not found');
    }

    if (!conversation.participants.some(p => p.toString() === userId.toString())) {
      throw new ApiError(403, 'You are not a participant in this conversation');
    }

    const messages = await messageRepository.findByConversation(conversationId, options);
    
    // Mark messages as read asynchronously
    await messageRepository.markAsRead(conversationId, userId);

    return messages;
  }
}


module.exports = new ChatService();
