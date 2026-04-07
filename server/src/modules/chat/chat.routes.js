const express = require('express');
const chatController = require('./chat.controller');
const { authenticate } = require('../../shared/middlewares/auth.middleware');
const { uploadChatAttachments } = require('../../shared/middlewares/upload.middleware');

const router = express.Router();

router.use(authenticate); // All chat routes require authentication

router.route('/conversations')
  .get(chatController.getConversations);

router.route('/conversations/direct')
  .post(chatController.createDirectConversation);

router.route('/conversations/:conversationId/messages')
  .get(chatController.getMessages)
  .post(uploadChatAttachments, chatController.sendMessage);

router.route('/conversations/:conversationId/read')
  .post(chatController.markAsRead);

module.exports = router;
