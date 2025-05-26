const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth.middleware');
const messageController = require('../controllers/message.controller');

// Create a new conversation
router.post('/conversations', requireAuth, messageController.createConversation);

// Get user's conversations
router.get('/conversations', requireAuth, messageController.getUserConversations);

// Send a message
router.post('/messages', requireAuth, messageController.sendMessage);

// Get conversation messages
router.get('/conversations/:conversationId/messages', requireAuth, messageController.getConversationMessages);

// Archive conversation
router.put('/conversations/:conversationId/archive', requireAuth, messageController.archiveConversation);

module.exports = router; 