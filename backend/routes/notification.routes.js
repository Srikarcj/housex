const express = require('express');
const router = express.Router();
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  cacheMiddleware
} = require('../controllers/notification.controller');

// Apply Clerk authentication to all routes
router.use(ClerkExpressRequireAuth());

// Get user's notifications with caching
router.get('/', cacheMiddleware(300), getUserNotifications);

// Mark a notification as read
router.put('/:id/read', markAsRead);

// Mark all notifications as read
router.put('/read-all', markAllAsRead);

// Delete a notification
router.delete('/:id', deleteNotification);

// Create a new notification
router.post('/', createNotification);

module.exports = router; 