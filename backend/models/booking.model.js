const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['interior_painting', 'exterior_painting', 'home_renovation', 'other'],
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'completed', 'cancelled'],
    default: 'pending',
    index: true
  },
  contactInfo: {
    type: {
      type: String,
      enum: ['email', 'phone'],
      required: true
    },
    value: {
      type: String,
      required: true
    }
  },
  jobDetails: {
    description: {
      type: String,
      required: true
    },
    location: {
      address: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    preferredDate: Date,
    preferredTime: String,
    budget: Number,
    duration: Number, // in hours
    additionalNotes: String
  },
  schedule: {
    startDate: Date,
    endDate: Date,
    actualStartDate: Date,
    actualEndDate: Date
  },
  payment: {
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'partial', 'completed'],
      default: 'pending'
    },
    transactions: [{
      amount: Number,
      date: Date,
      status: String,
      transactionId: String
    }]
  },
  review: {
    rating: Number,
    comment: String,
    date: Date
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

// Indexes for better query performance
bookingSchema.index({ client: 1, status: 1 });
bookingSchema.index({ professional: 1, status: 1 });
bookingSchema.index({ 'contactInfo.value': 1 });

// Compound indexes for common query patterns
bookingSchema.index({ client: 1, 'schedule.startDate': -1 });
bookingSchema.index({ professional: 1, 'schedule.startDate': -1 });
bookingSchema.index({ status: 1, 'schedule.startDate': -1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking; 