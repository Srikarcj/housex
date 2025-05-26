const express = require('express');
const router = express.Router();
const { Chat, Message } = require('../models/schema');
const { validateRequest } = require('../middleware/auth');
const { Configuration, OpenAIApi } = require('openai');
const socketIO = require('socket.io');

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

let io;

// Initialize Socket.IO
const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join user's room
    socket.on('join', (userId) => {
      socket.join(userId);
    });

    // Handle typing indicator
    socket.on('typing', ({ chatId, userId }) => {
      socket.to(chatId).emit('typing', { userId });
    });

    // Handle message read status
    socket.on('messageRead', async ({ messageId, userId }) => {
      try {
        await Message.findByIdAndUpdate(messageId, {
          readBy: { $addToSet: userId }
        });
        io.to(messageId).emit('messageRead', { messageId, userId });
      } catch (error) {
        console.error('Error updating message read status:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

// Create a new chat
router.post('/', validateRequest, async (req, res) => {
  try {
    const { participantId, initialMessage } = req.body;

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [req.auth.userId, participantId] }
    });

    if (!chat) {
      chat = new Chat({
        participants: [req.auth.userId, participantId],
        lastMessage: null,
        unreadCount: { [req.auth.userId]: 0, [participantId]: 0 }
      });
      await chat.save();
    }

    if (initialMessage) {
      const message = new Message({
        chatId: chat._id,
        senderId: req.auth.userId,
        content: initialMessage,
        type: 'text'
      });
      await message.save();

      chat.lastMessage = message._id;
      chat.unreadCount[participantId]++;
      await chat.save();

      // Emit new message
      io.to(participantId).emit('newMessage', {
        chatId: chat._id,
        message
      });
    }

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Error creating chat' });
  }
});

// Send a message
router.post('/:chatId/messages', validateRequest, async (req, res) => {
  try {
    const { content, type = 'text', attachments } = req.body;
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Create message
    const message = new Message({
      chatId: chat._id,
      senderId: req.auth.userId,
      content,
      type,
      attachments
    });
    await message.save();

    // Update chat
    chat.lastMessage = message._id;
    chat.unreadCount[req.auth.userId] = 0;
    chat.participants.forEach(participantId => {
      if (participantId !== req.auth.userId) {
        chat.unreadCount[participantId]++;
      }
    });
    await chat.save();

    // Emit new message to all participants
    chat.participants.forEach(participantId => {
      io.to(participantId).emit('newMessage', {
        chatId: chat._id,
        message
      });
    });

    // Generate AI response if it's a query
    if (type === 'query') {
      const prompt = `As a home services assistant, provide a helpful response to this query: ${content}`;
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 150
      });

      const aiResponse = completion.data.choices[0].text.trim();

      const aiMessage = new Message({
        chatId: chat._id,
        senderId: 'ai',
        content: aiResponse,
        type: 'ai'
      });
      await aiMessage.save();

      // Update chat with AI response
      chat.lastMessage = aiMessage._id;
      await chat.save();

      // Emit AI response
      chat.participants.forEach(participantId => {
        io.to(participantId).emit('newMessage', {
          chatId: chat._id,
          message: aiMessage
        });
      });
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error sending message' });
  }
});

// Get chat messages
router.get('/:chatId/messages', validateRequest, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const messages = await Message.find({ chatId: chat._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({ chatId: chat._id });

    // Mark messages as read
    await Message.updateMany(
      {
        chatId: chat._id,
        senderId: { $ne: req.auth.userId },
        readBy: { $ne: req.auth.userId }
      },
      {
        $addToSet: { readBy: req.auth.userId }
      }
    );

    // Update unread count
    chat.unreadCount[req.auth.userId] = 0;
    await chat.save();

    res.json({
      messages,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

// Get user's chats
router.get('/', validateRequest, async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.auth.userId })
      .populate('participants', 'firstName lastName profilePicture')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching chats' });
  }
});

// Delete a message
router.delete('/messages/:messageId', validateRequest, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.senderId !== req.auth.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this message' });
    }

    await message.remove();

    // Emit message deletion
    io.to(message.chatId).emit('messageDeleted', {
      chatId: message.chatId,
      messageId: message._id
    });

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting message' });
  }
});

// Get AI suggestions for a query
router.post('/ai/suggestions', validateRequest, async (req, res) => {
  try {
    const { query, context } = req.body;

    const prompt = `As a home services assistant, provide helpful suggestions for this query: ${query}
    Context: ${context}
    Provide suggestions in the following format:
    1. Direct answer
    2. Related services
    3. Common questions
    4. Next steps`;

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 250
    });

    const suggestions = completion.data.choices[0].text.trim();

    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ error: 'Error generating suggestions' });
  }
});

module.exports = {
  router,
  initializeSocket
}; 