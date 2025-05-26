const Notification = require('../models/notification.model');
const User = require('../models/user.model');

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Cache middleware with better error handling
const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl || req.url}`;
    
    try {
      const cachedData = cache.get(key);
      if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
        console.log('Cache hit for key:', key);
        return res.json(cachedData.data);
      }
      console.log('Cache miss for key:', key);
      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// Get user's notifications
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const cacheKey = `notifications:${userId}`;

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      read: false
    });

    const response = {
      notifications,
      unreadCount,
      total: notifications.length,
      page: 1,
      totalPages: 1,
      hasMore: false
    };

    // Cache the response
    cache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });

    res.json(response);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      error: 'Failed to fetch notifications',
      notifications: [],
      unreadCount: 0,
      total: 0,
      page: 1,
      totalPages: 1,
      hasMore: false
    });
  }
};

// Mark a notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.auth.userId;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: userId },
      { read: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Invalidate cache
    const cacheKey = `notifications:${userId}`;
    cache.delete(cacheKey);

    res.json({ success: true, notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.auth.userId;

    await Notification.updateMany(
      { recipient: userId, read: false },
      { read: true, readAt: new Date() }
    );

    // Invalidate cache
    const cacheKey = `notifications:${userId}`;
    cache.delete(cacheKey);

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.auth.userId;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      recipient: userId
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Invalidate cache
    const cacheKey = `notifications:${userId}`;
    cache.delete(cacheKey);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { recipient, type, title, message, data, priority } = req.body;

    const notification = new Notification({
      recipient,
      type,
      title,
      message,
      data,
      priority
    });

    await notification.save();

    // Invalidate cache for the recipient
    const cacheKey = `notifications:${recipient}`;
    cache.delete(cacheKey);

    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  cacheMiddleware
}; 