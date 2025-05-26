const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['client', 'painter', 'housebuilder', 'admin'],
    required: true
  },
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
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
    profilePhoto: String,
    bio: String
  },
  // For professionals only
  professionalProfile: {
    yearsOfExperience: Number,
    specialties: [String],
    rate: Number,
    availability: {
      type: Boolean,
      default: true
    },
    portfolio: [{
      title: String,
      description: String,
      imageUrl: String,
      date: Date
    }],
    rating: {
      average: {
        type: Number,
        default: 0
      },
      count: {
        type: Number,
        default: 0
      }
    }
  },
  // For clients only
  savedProfessionals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
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
userSchema.index({ 'profile.location.city': 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'professionalProfile.specialties': 1 });

const User = mongoose.model('User', userSchema);

module.exports = User; 