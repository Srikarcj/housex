const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageData: { type: String, required: true }, // Base64 image data
  category: { type: String, enum: ['builder', 'painter'], required: true },
  createdAt: { type: Date, default: Date.now }
});

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
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
    required: true
  },
  phone: String,
  isProfessional: {
    type: Boolean,
    default: false
  },
  professionalDetails: {
    services: [{
      type: String,
      enum: ['interior_painting', 'exterior_painting', 'home_renovation', 'other']
    }],
    experience: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0
    },
    location: {
      city: String,
      state: String,
      zipCode: String
    },
    availability: {
      type: Boolean,
      default: true
    },
    hourlyRate: {
      type: Number,
      default: 0
    },
    bio: String,
    certifications: [String],
    portfolio: [{
      title: String,
      description: String,
      imageUrl: String,
      date: Date
    }]
  },
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: true
      }
    },
    language: {
      type: String,
      default: 'en'
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
});

// Update the updatedAt timestamp before saving
userProfileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile; 