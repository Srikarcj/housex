const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');
const User = require('../models/user.model');

// Create a new conversation
const createConversation = async (req, res) => {
  try {
    const { participantId, bookingId } = req.body;
    const user = await User.findOne({ clerkId: req.auth.userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      participants: { $all: [user._id, participantId] },
      booking: bookingId
    });

    if (existingConversation) {
      return res.json(existingConversation);
    }

    const conversation = new Conversation({
      participants: [user._id, participantId],
      booking: bookingId
    });

    await conversation.save();
    await conversation.populate('participants', 'profile');

    res.status(201).json(conversation);
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's conversations
const getUserConversations = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const conversations = await Conversation.find({
      participants: user._id,
      status: 'active'
    })
      .populate('participants', 'profile')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    console.error('Get user conversations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { conversationId, content, attachments } = req.body;
    const user = await User.findOne({ clerkId: req.auth.userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is a participant
    if (!conversation.participants.includes(user._id)) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const message = new Message({
      conversation: conversationId,
      sender: user._id,
      content,
      attachments,
      readBy: [{ user: user._id }]
    });

    await message.save();

    // Update conversation's last message and unread count
    conversation.lastMessage = message._id;
    conversation.unreadCount.set(
      conversation.participants.find(p => p.toString() !== user._id.toString()),
      (conversation.unreadCount.get(
        conversation.participants.find(p => p.toString() !== user._id.toString())
      ) || 0) + 1
    );

    await conversation.save();

    await message.populate('sender', 'profile');
    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get conversation messages
const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const user = await User.findOne({ clerkId: req.auth.userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is a participant
    if (!conversation.participants.includes(user._id)) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'profile')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Mark messages as read
    const unreadMessages = messages.filter(
      message => !message.readBy.some(read => read.user.toString() === user._id.toString())
    );

    if (unreadMessages.length > 0) {
      await Message.updateMany(
        { _id: { $in: unreadMessages.map(m => m._id) } },
        { $push: { readBy: { user: user._id } } }
      );

      // Reset unread count for this user
      conversation.unreadCount.set(user._id.toString(), 0);
      await conversation.save();
    }

    res.json(messages.reverse());
  } catch (error) {
    console.error('Get conversation messages error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Archive conversation
const archiveConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const user = await User.findOne({ clerkId: req.auth.userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is a participant
    if (!conversation.participants.includes(user._id)) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    conversation.status = 'archived';
    await conversation.save();

    res.json({ message: 'Conversation archived successfully' });
  } catch (error) {
    console.error('Archive conversation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createConversation,
  getUserConversations,
  sendMessage,
  getConversationMessages,
  archiveConversation
}; 