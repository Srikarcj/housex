const express = require('express');
const router = express.Router();
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const UserProfile = require('../models/UserProfile');

// Apply auth middleware to all routes
router.use(ClerkExpressRequireAuth());

// Get user profile
router.get('/', async (req, res) => {
  try {
    let profile = await UserProfile.findOne({ userId: req.auth.userId });
    
    if (!profile) {
      // Create a default profile if none exists
      profile = new UserProfile({
        userId: req.auth.userId,
        email: req.auth.email,
        firstName: req.auth.firstName || '',
        lastName: req.auth.lastName || '',
        accountType: 'builder', // Default account type
        createdAt: new Date(),
        lastUpdated: new Date()
      });
      await profile.save();
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update user profile
router.put('/', async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Validate account type
    if (updateData.accountType && !['builder', 'painter'].includes(updateData.accountType)) {
      return res.status(400).json({ message: 'Invalid account type' });
    }

    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.auth.userId },
      { 
        ...updateData,
        lastUpdated: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Delete user profile
router.delete('/', async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndDelete({ userId: req.auth.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ message: 'Error deleting profile' });
  }
});

// Add portfolio item
router.post('/portfolio', async (req, res) => {
  try {
    const { itemId } = req.body;
    const profile = await UserProfile.findOne({ userId: req.auth.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    profile.portfolio.push(itemId);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error('Error adding portfolio item:', error);
    res.status(500).json({ message: 'Error adding portfolio item' });
  }
});

// Remove portfolio item
router.delete('/portfolio/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const profile = await UserProfile.findOne({ userId: req.auth.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    profile.portfolio = profile.portfolio.filter((id) => id.toString() !== itemId);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error('Error removing portfolio item:', error);
    res.status(500).json({ message: 'Error removing portfolio item' });
  }
});

// Get user bookings
router.get('/bookings', async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.auth.userId });
    if (!profile || !profile.bookings) {
      return res.status(404).json({ message: 'No bookings found' });
    }
    res.json(profile.bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

module.exports = router; 