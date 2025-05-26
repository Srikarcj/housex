const { Chat, Message, UserProfile } = require('../models/schema');

const chatController = {
  // Create a new chat
  async createChat(req, res) {
    try {
      const { participants, chatType, bookingId } = req.body;

      // Check if chat already exists
      const existingChat = await Chat.findOne({
        participants: { $all: participants },
        chatType
      });

      if (existingChat) {
        return res.json({
          success: true,
          data: existingChat
        });
      }

      // Create new chat
      const chat = await Chat.create({
        participants,
        chatType,
        bookingId
      });

      // Emit real-time notification
      participants.forEach(participantId => {
        req.io.to(participantId).emit('newChat', {
          chatId: chat._id,
          participants
        });
      });

      res.status(201).json({
        success: true,
        data: chat
      });
    } catch (error) {
      console.error('Chat creation error:', error);
      res.status(500).json({
        success: false,
        error: 'Error creating chat'
      });
    }
  },

  // Send a message
  async sendMessage(req, res) {
    try {
      const { chatId } = req.params;
      const { content, type = 'text' } = req.body;
      const senderId = req.user.id;

      // Check if chat exists
      const chat = await Chat.findById(chatId);
      if (!chat) {
        return res.status(404).json({
          success: false,
          error: 'Chat not found'
        });
      }

      // Check if user is part of the chat
      if (!chat.participants.includes(senderId)) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to send messages in this chat'
        });
      }

      // Create message
      const message = await Message.create({
        chatId,
        senderId,
        content,
        type,
        readBy: [senderId]
      });

      // Update chat's last message and unread count
      chat.lastMessage = message._id;
      chat.updatedAt = new Date();
      
      // Increment unread count for other participants
      chat.participants.forEach(participantId => {
        if (participantId !== senderId) {
          const currentCount = chat.unreadCount.get(participantId) || 0;
          chat.unreadCount.set(participantId, currentCount + 1);
        }
      });

      await chat.save();

      // Emit real-time message
      chat.participants.forEach(participantId => {
        req.io.to(participantId).emit('newMessage', {
          chatId,
          message: {
            ...message.toObject(),
            sender: {
              id: senderId,
              name: req.user.firstName + ' ' + req.user.lastName
            }
          }
        });
      });

      res.status(201).json({
        success: true,
        data: message
      });
    } catch (error) {
      console.error('Message sending error:', error);
      res.status(500).json({
        success: false,
        error: 'Error sending message'
      });
    }
  },

  // Get chat messages
  async getChatMessages(req, res) {
    try {
      const { chatId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const userId = req.user.id;

      // Check if chat exists
      const chat = await Chat.findById(chatId);
      if (!chat) {
        return res.status(404).json({
          success: false,
          error: 'Chat not found'
        });
      }

      // Check if user is part of the chat
      if (!chat.participants.includes(userId)) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to view this chat'
        });
      }

      // Get messages with pagination
      const messages = await Message.find({ chatId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      // Mark messages as read
      await Message.updateMany(
        {
          chatId,
          readBy: { $ne: userId }
        },
        {
          $addToSet: { readBy: userId }
        }
      );

      // Reset unread count
      chat.unreadCount.set(userId, 0);
      await chat.save();

      res.json({
        success: true,
        data: messages.reverse()
      });
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({
        success: false,
        error: 'Error getting messages'
      });
    }
  },

  // Get user's chats
  async getUserChats(req, res) {
    try {
      const userId = req.user.id;

      const chats = await Chat.find({
        participants: userId,
        isActive: true
      })
        .sort({ updatedAt: -1 })
        .populate('lastMessage');

      // Get participant details
      const chatsWithParticipants = await Promise.all(
        chats.map(async chat => {
          const participants = await UserProfile.find({
            userId: { $in: chat.participants }
          }).select('firstName lastName profileImage');

          return {
            ...chat.toObject(),
            participants
          };
        })
      );

      res.json({
        success: true,
        data: chatsWithParticipants
      });
    } catch (error) {
      console.error('Get chats error:', error);
      res.status(500).json({
        success: false,
        error: 'Error getting chats'
      });
    }
  },

  // Mark chat as read
  async markChatAsRead(req, res) {
    try {
      const { chatId } = req.params;
      const userId = req.user.id;

      const chat = await Chat.findById(chatId);
      if (!chat) {
        return res.status(404).json({
          success: false,
          error: 'Chat not found'
        });
      }

      // Reset unread count
      chat.unreadCount.set(userId, 0);
      await chat.save();

      // Mark all messages as read
      await Message.updateMany(
        {
          chatId,
          readBy: { $ne: userId }
        },
        {
          $addToSet: { readBy: userId }
        }
      );

      res.json({
        success: true,
        data: chat
      });
    } catch (error) {
      console.error('Mark chat as read error:', error);
      res.status(500).json({
        success: false,
        error: 'Error marking chat as read'
      });
    }
  }
};

module.exports = chatController; 