const chatService = require('./chat.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const ApiResponse = require('../../shared/utils/ApiResponse');

class ChatController {
  createDirectConversation = asyncHandler(async (req, res) => {
    const { recipientId, productId, tradeListingId } = req.body;
    const conversation = await chatService.createDirectConversation(req.user._id, recipientId, {
      productId,
      tradeListingId,
    });

    res.status(201).json(ApiResponse.created(conversation, 'Conversation ready'));
  });

  sendMessage = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    const message = await chatService.sendMessage(conversationId, req.user._id, req.body, req.files || []);
    res.status(201).json(ApiResponse.created(message, 'Message sent successfully'));
  });

  getConversations = asyncHandler(async (req, res) => {
    const conversations = await chatService.getUserConversations(req.user._id);
    res.status(200).json(ApiResponse.success(conversations, 'Conversations fetched successfully'));
  });

  getMessages = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    const { limit, skip } = req.query;
    const messages = await chatService.getConversationMessages(conversationId, req.user._id, {
      limit: parseInt(limit, 10) || 50,
      skip: parseInt(skip, 10) || 0,
    });
    res.status(200).json(ApiResponse.success(messages, 'Messages fetched successfully'));
  });

  markAsRead = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    await chatService.getConversationMessages(conversationId, req.user._id);
    res.status(200).json(ApiResponse.success(null, 'Messages marked as read'));
  });
}

module.exports = new ChatController();
