const express = require('express');
const router = express.Router();
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const UserProfile = require('../models/UserProfile');

// Apply auth middleware to all routes
router.use(ClerkExpressRequireAuth());

// Get all professionals
router.get('/', async (req, res) => {
  try {
    const professionals = await UserProfile.find({ 
      isProfessional: true,
      'professionalDetails.availability': true 
    })
    .select('firstName lastName professionalDetails')
    .sort({ 'professionalDetails.rating': -1 });

    res.json({
      success: true,
      professionals: professionals.map(prof => ({
        _id: prof._id,
        firstName: prof.firstName,
        lastName: prof.lastName,
        serviceType: prof.professionalDetails.services,
        rating: prof.professionalDetails.rating,
        experience: prof.professionalDetails.experience,
        location: prof.professionalDetails.location
      }))
    });
  } catch (error) {
    console.error('Error fetching professionals:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching professionals' 
    });
  }
});

// Get professional by ID
router.get('/:id', async (req, res) => {
  try {
    const professional = await UserProfile.findOne({
      _id: req.params.id,
      isProfessional: true
    }).select('-preferences');

    if (!professional) {
      return res.status(404).json({ 
        success: false, 
        message: 'Professional not found' 
      });
    }

    res.json({
      success: true,
      professional
    });
  } catch (error) {
    console.error('Error fetching professional:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching professional' 
    });
  }
});

// Get available dates for a professional
router.get('/:id/available-dates', async (req, res) => {
  try {
    const professional = await UserProfile.findOne({
      _id: req.params.id,
      isProfessional: true
    });

    if (!professional) {
      return res.status(404).json({ 
        success: false, 
        message: 'Professional not found' 
      });
    }

    // Get next 14 days
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }

    res.json({
      success: true,
      dates
    });
  } catch (error) {
    console.error('Error fetching available dates:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching available dates' 
    });
  }
});

module.exports = router; 