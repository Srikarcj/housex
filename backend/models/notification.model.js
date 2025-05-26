const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      // Booking notifications
      'booking_request',
      'booking_accepted',
      'booking_declined',
      'booking_completed',
      'booking_cancelled',
      'booking_reminder',
      'booking_schedule_changed',
      
      // Message notifications
      'new_message',
      'message_read',
      
      // Review notifications
      'new_review',
      'review_response',
      'review_helpful',
      
      // Payment notifications
      'payment_received',
      'payment_failed',
      'refund_processed',
      
      // Profile notifications
      'profile_updated',
      'verification_completed',
      'account_suspended',
      
      // System notifications
      'system_update',
      'maintenance_notice',
      'security_alert'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  expiresAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for faster queries
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ read: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ expiresAt: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification; 