const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProfile',
    required: true
  },
  professionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProfile',
    required: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['interior', 'exterior', 'both']
  },
  schedule: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // Duration in hours
    required: true,
    min: 1,
    max: 24
  },
  location: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Update lastUpdated timestamp before saving
bookingSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Index for efficient querying
bookingSchema.index({ professionalId: 1, date: 1 });
bookingSchema.index({ customerId: 1, date: 1 });
bookingSchema.index({ status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking; 