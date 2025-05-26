const mongoose = require('mongoose');

const notificationPreferenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    enabled: {
      type: Boolean,
      default: true
    },
    types: {
      booking_request: { type: Boolean, default: true },
      booking_accepted: { type: Boolean, default: true },
      booking_declined: { type: Boolean, default: true },
      booking_completed: { type: Boolean, default: true },
      booking_cancelled: { type: Boolean, default: true },
      booking_reminder: { type: Boolean, default: true },
      booking_schedule_changed: { type: Boolean, default: true },
      new_message: { type: Boolean, default: true },
      new_review: { type: Boolean, default: true },
      review_response: { type: Boolean, default: true },
      review_helpful: { type: Boolean, default: true },
      payment_received: { type: Boolean, default: true },
      payment_failed: { type: Boolean, default: true },
      refund_processed: { type: Boolean, default: true },
      profile_updated: { type: Boolean, default: true },
      verification_completed: { type: Boolean, default: true },
      account_suspended: { type: Boolean, default: true },
      system_update: { type: Boolean, default: true },
      maintenance_notice: { type: Boolean, default: true },
      security_alert: { type: Boolean, default: true }
    }
  },
  push: {
    enabled: {
      type: Boolean,
      default: true
    },
    types: {
      booking_request: { type: Boolean, default: true },
      booking_accepted: { type: Boolean, default: true },
      booking_declined: { type: Boolean, default: true },
      booking_completed: { type: Boolean, default: true },
      booking_cancelled: { type: Boolean, default: true },
      booking_reminder: { type: Boolean, default: true },
      booking_schedule_changed: { type: Boolean, default: true },
      new_message: { type: Boolean, default: true },
      new_review: { type: Boolean, default: true },
      review_response: { type: Boolean, default: true },
      review_helpful: { type: Boolean, default: true },
      payment_received: { type: Boolean, default: true },
      payment_failed: { type: Boolean, default: true },
      refund_processed: { type: Boolean, default: true },
      profile_updated: { type: Boolean, default: true },
      verification_completed: { type: Boolean, default: true },
      account_suspended: { type: Boolean, default: true },
      system_update: { type: Boolean, default: true },
      maintenance_notice: { type: Boolean, default: true },
      security_alert: { type: Boolean, default: true }
    }
  },
  inApp: {
    enabled: {
      type: Boolean,
      default: true
    },
    types: {
      booking_request: { type: Boolean, default: true },
      booking_accepted: { type: Boolean, default: true },
      booking_declined: { type: Boolean, default: true },
      booking_completed: { type: Boolean, default: true },
      booking_cancelled: { type: Boolean, default: true },
      booking_reminder: { type: Boolean, default: true },
      booking_schedule_changed: { type: Boolean, default: true },
      new_message: { type: Boolean, default: true },
      new_review: { type: Boolean, default: true },
      review_response: { type: Boolean, default: true },
      review_helpful: { type: Boolean, default: true },
      payment_received: { type: Boolean, default: true },
      payment_failed: { type: Boolean, default: true },
      refund_processed: { type: Boolean, default: true },
      profile_updated: { type: Boolean, default: true },
      verification_completed: { type: Boolean, default: true },
      account_suspended: { type: Boolean, default: true },
      system_update: { type: Boolean, default: true },
      maintenance_notice: { type: Boolean, default: true },
      security_alert: { type: Boolean, default: true }
    }
  },
  quietHours: {
    enabled: {
      type: Boolean,
      default: false
    },
    start: {
      type: String,
      default: '22:00'
    },
    end: {
      type: String,
      default: '08:00'
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for faster queries
notificationPreferenceSchema.index({ user: 1 });

const NotificationPreference = mongoose.model('NotificationPreference', notificationPreferenceSchema);

module.exports = NotificationPreference; 