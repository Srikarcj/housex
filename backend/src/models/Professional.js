const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema({
  userId: {
    type: String, // Clerk user ID
    required: true,
    unique: true
  },
  accountType: {
    type: String,
    required: true,
    enum: ['painter', 'plumber', 'contractor']
  },
  name: {
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
  businessName: {
    type: String,
    required: true
  },
  services: [{
    type: String,
    required: true
  }],
  hourlyRate: {
    type: Number,
    required: true
  },
  availability: {
    monday: { start: String, end: String },
    tuesday: { start: String, end: String },
    wednesday: { start: String, end: String },
    thursday: { start: String, end: String },
    friday: { start: String, end: String },
    saturday: { start: String, end: String },
    sunday: { start: String, end: String }
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
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  documents: [{
    type: {
      type: String,
      enum: ['license', 'insurance', 'certification']
    },
    url: String,
    verified: Boolean
  }],
  bio: String,
  profileImage: String,
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

// Indexes for efficient querying
professionalSchema.index({ accountType: 1 });
professionalSchema.index({ location: '2dsphere' });
professionalSchema.index({ rating: -1 });

const Professional = mongoose.model('Professional', professionalSchema);

module.exports = Professional; 