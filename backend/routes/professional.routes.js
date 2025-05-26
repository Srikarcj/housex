const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');

// Get all professionals
router.get('/', async (req, res) => {
  try {
    const professionals = await UserProfile.find({ 
      accountType: 'painter'
    }).select('firstName lastName email phone profilePhoto bio location services rating');
    
    res.json(professionals);
  } catch (error) {
    console.error('Error fetching professionals:', error);
    res.status(500).json({ message: 'Error fetching professionals' });
  }
});

// Get professional by ID
router.get('/:id', async (req, res) => {
  try {
    const professional = await UserProfile.findOne({
      _id: req.params.id,
      accountType: 'painter'
    }).select('firstName lastName email phone profilePhoto bio location services rating portfolio');

    if (!professional) {
      return res.status(404).json({ message: 'Professional not found' });
    }

    res.json(professional);
  } catch (error) {
    console.error('Error fetching professional:', error);
    res.status(500).json({ message: 'Error fetching professional' });
  }
});

// Get professional's available dates
router.get('/:id/available-dates', async (req, res) => {
  try {
    const professional = await UserProfile.findOne({
      _id: req.params.id,
      accountType: 'painter'
    }).select('availability');

    if (!professional) {
      return res.status(404).json({ message: 'Professional not found' });
    }

    res.json(professional.availability);
  } catch (error) {
    console.error('Error fetching available dates:', error);
    res.status(500).json({ message: 'Error fetching available dates' });
  }
});

module.exports = router; 