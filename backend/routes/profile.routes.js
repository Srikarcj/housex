const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');

// Get user profile
router.get('/', async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.auth.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Create or update user profile
router.post('/', async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.auth.userId },
      { ...req.body, userId: req.auth.userId },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Delete user profile
router.delete('/', async (req, res) => {
  try {
    await UserProfile.findOneAndDelete({ userId: req.auth.userId });
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ message: 'Error deleting profile' });
  }
});

module.exports = router; 