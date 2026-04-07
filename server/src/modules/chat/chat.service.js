const mongoose = require('mongoose');
const conversationRepository = require('./conversation.repository');
const messageRepository = require('./message.repository');
const notificationService = require('../notification/notification.service');
const userRepository = require('../user/user.repository');
const ApiError = require('../../shared/utils/ApiError');
const { getIO } = require('../../config/socket');
const { uploadFilesToCloudinary } = require('../../shared/utils/cloudinaryAsset');

class ChatService {
  async createDirectConversation(senderId, recipientId, context = {}) {
    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      throw ApiError.badRequest('Recipient is invalid');
    }

    if (senderId.toString() === recipientId.toString()) {
      throw new ApiError(400, 'You cannot start a conversation with yourself');
    }

    const recipient = await userRepository.findById(recipientId);
    if (!recipient) {
      throw new ApiError(404, 'Recipient not found');
    }

    const participantIds = [senderId, recipientId];
    const existingConversation = await conversationRepository.findDirectConversation(participantIds);
    if (existingConversation) {
      return existingConversation;
    }

    return conversationRepository.create({
      kind: 'direct',
      participants: participantIds,
      relatedProduct: context.productId || null,
      relatedTradeListing: context.tradeListingId || null,
    });
  }

  /**
   * Send a message in a conversation
   */
  async sendMessage(conversationId, senderId, payload = {}, files = []) {
    const conversation = await conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new ApiError(404, 'Conversation not found');
    }

    if (!conversation.participants.some(p => p.toString() === senderId.toString())) {
      throw new ApiError(403, 'You are not a participant in this conversation');
    }

    const text = typeof payload === 'string' ? payload : (payload.text || '');
    const attachments = files.length > 0
      ? await this._resolveMessageAttachments(files)
      : [];

    if (!text.trim() && attachments.length === 0) {
      throw new ApiError(400, 'Message text or attachments are required');
    }

    const messageType = this._resolveMessageType(text, attachments);

    const message = await messageRepository.create({
      conversation: conversationId,
      sender: senderId,
      text,
      attachments,
      messageType,
      readBy: [senderId],
    });

    await conversationRepository.updateLastMessage(conversationId, message._id);

    const populatedMessage = await message.populate('sender', 'displayName avatar');
    const messagePreview = this._buildMessagePreview(populatedMessage);

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
        message: messagePreview.substring(0, 80),
        link: `/chat?conversation=${conversationId}`,
        metadata: {
          conversationId,
          senderId,
        },
      });

      io.to(otherParticipantId.toString()).emit('new_message_notification', {
        conversationId,
        sender: populatedMessage.sender.displayName,
        text: messagePreview.substring(0, 50) + (messagePreview.length > 50 ? '...' : ''),
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

  _resolveMessageType(text, attachments = []) {
    if (attachments.length === 0) {
      return 'text';
    }

    if (text.trim()) {
      return 'mixed';
    }

    const uniqueKinds = [...new Set(attachments.map((attachment) => attachment.kind))];
    return uniqueKinds.length === 1 ? uniqueKinds[0] : 'mixed';
  }

  async _resolveMessageAttachments(files = []) {
    if (!files.length) {
      return [];
    }

    const uploadedFiles = await uploadFilesToCloudinary(files, {
      folder: 'gundam-universe/chat/attachments',
      resource_type: 'auto',
    });

    return uploadedFiles.map((file, index) => ({
      kind: this._resolveAttachmentKind(files[index]?.mimetype),
      url: file.url,
      publicId: file.publicId,
      mimeType: files[index]?.mimetype || 'application/octet-stream',
      originalName: files[index]?.originalname || '',
      bytes: file.bytes || files[index]?.size || 0,
      duration: file.duration || null,
    }));
  }

  _resolveAttachmentKind(mimeType = '') {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'image';
  }

  _buildMessagePreview(message) {
    if (message.text?.trim()) {
      return message.text.trim();
    }

    if (!message.attachments?.length) {
      return 'New message';
    }

    const kinds = [...new Set(message.attachments.map((attachment) => attachment.kind))];
    if (kinds.length > 1) return 'Shared attachments';
    if (kinds[0] === 'image') return 'Shared images';
    if (kinds[0] === 'video') return 'Shared a video';
    if (kinds[0] === 'audio') return 'Shared a voice note';
    return 'Shared attachments';
  }
}


module.exports = new ChatService();
