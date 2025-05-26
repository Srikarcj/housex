const mongoose = require('mongoose');

// User Profile Schema with enhanced features
const userProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  userType: {
    type: String,
    enum: ['client', 'painter', 'builder'],
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  profileImage: {
    type: String,
    default: 'default-avatar.png'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isProfessional: {
    type: Boolean,
    default: false
  },
  professionalDetails: {
    businessName: String,
    services: [String],
    description: String,
    hourlyRate: Number,
    rating: {
      type: Number,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    reviews: [{
      userId: String,
      rating: Number,
      comment: String,
      serviceType: String,
      date: Date
    }],
    availability: [{
      day: String,
      slots: [{
        start: String,
        end: String,
        isBooked: {
          type: Boolean,
          default: false
        }
      }]
    }],
    serviceAreas: [{
      city: String,
      radius: Number
    }],
    pricing: {
      baseRate: Number,
      serviceRates: [{
        service: String,
        rate: Number
      }],
      minimumHours: Number,
      cancellationPolicy: String
    },
    skills: [String],
    certifications: [{
      name: String,
      issuer: String,
      date: Date,
      expiry: Date
    }],
    insurance: {
      provider: String,
      policyNumber: String,
      coverage: String,
      expiry: Date
    },
    portfolio: [{
      title: String,
      description: String,
      imageUrl: String,
      date: Date
    }]
  },
  preferences: {
    notifications: {
      email: Boolean,
      sms: Boolean,
      push: Boolean
    },
    language: String,
    timezone: String,
    theme: String
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Enhanced Booking Schema
const bookingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  professionalId: {
    type: String,
    required: true
  },
  serviceType: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  recurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    frequency: String,
    interval: Number,
    endDate: Date
  },
  customRequirements: [String],
  estimatedCost: Number,
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'completed', 'refunded'],
    default: 'pending'
  },
  notes: [{
    text: String,
    timestamp: Date,
    userId: String
  }],
  cancellationReason: String,
  refundRequested: Boolean,
  cancelledAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Enhanced Chat Schema
const chatSchema = new mongoose.Schema({
  participants: [{
    type: String,
    required: true
  }],
  chatType: {
    type: String,
    enum: ['direct', 'support', 'booking'],
    default: 'direct'
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: new Map()
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Enhanced Message Schema
const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  senderId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'system'],
    default: 'text'
  },
  readBy: [{
    type: String
  }],
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Enhanced Search History Schema
const searchHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  query: String,
  filters: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  results: [{
    type: String,
    id: String,
    relevance: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create and export models
const UserProfile = mongoose.model('UserProfile', userProfileSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Chat = mongoose.model('Chat', chatSchema);
const Message = mongoose.model('Message', messageSchema);
const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);

module.exports = {
  UserProfile,
  Booking,
  Chat,
  Message,
  SearchHistory
}; 