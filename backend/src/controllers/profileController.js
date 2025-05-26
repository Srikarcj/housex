const UserProfile = require('../models/UserProfile');
const Booking = require('../models/Booking');

const profileController = {
  getProfile: async (req, res) => {
    try {
      let profile = await UserProfile.findOne({ userId: req.auth.userId });
      if (!profile) {
        // Create a new profile if it doesn't exist
        profile = new UserProfile({
          userId: req.auth.userId,
          email: req.auth.email,
          firstName: req.auth.firstName,
          lastName: req.auth.lastName,
          accountType: req.auth.accountType || 'builder',
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
  },

  updateProfile: async (req, res) => {
    try {
      const updateData = { ...req.body };
      
      // Validate account type
      if (updateData.accountType && !['builder', 'painter'].includes(updateData.accountType)) {
        return res.status(400).json({ message: 'Invalid account type' });
      }

      // Handle profile picture if it's a Base64 string
      if (updateData.profilePicture && updateData.profilePicture.startsWith('data:image')) {
        // Validate image size (max 5MB)
        const base64Data = updateData.profilePicture.split(',')[1];
        const imageSize = Math.ceil((base64Data.length * 3) / 4);
        if (imageSize > 5 * 1024 * 1024) {
          return res.status(400).json({ message: 'Image size should be less than 5MB' });
        }
      }

      // Validate phone number if provided
      if (updateData.phone && !/^\+?[\d\s-]{10,}$/.test(updateData.phone)) {
        return res.status(400).json({ message: 'Invalid phone number format' });
      }

      // Validate hourly rate if provided
      if (updateData.hourlyRate && isNaN(updateData.hourlyRate)) {
        return res.status(400).json({ message: 'Invalid hourly rate' });
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
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error updating profile' });
    }
  },

  addPortfolioItem: async (req, res) => {
    try {
      const { title, description, category, imageData } = req.body;

      // Validate required fields
      if (!title || !category || !imageData) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Validate category
      if (!['builder', 'painter'].includes(category)) {
        return res.status(400).json({ message: 'Invalid category' });
      }

      // Validate image data
      if (!imageData.startsWith('data:image')) {
        return res.status(400).json({ message: 'Invalid image data' });
      }

      // Validate image size (max 5MB)
      const base64Data = imageData.split(',')[1];
      const imageSize = Math.ceil((base64Data.length * 3) / 4);
      if (imageSize > 5 * 1024 * 1024) {
        return res.status(400).json({ message: 'Image size should be less than 5MB' });
      }

      const portfolioItem = {
        title,
        description,
        imageData,
        category
      };

      const profile = await UserProfile.findOneAndUpdate(
        { userId: req.auth.userId },
        { 
          $push: { portfolio: portfolioItem },
          lastUpdated: new Date()
        },
        { new: true, runValidators: true }
      );

      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      res.json(profile);
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error adding portfolio item' });
    }
  },

  removePortfolioItem: async (req, res) => {
    try {
      const profile = await UserProfile.findOneAndUpdate(
        { userId: req.auth.userId },
        { 
          $pull: { portfolio: { _id: req.params.itemId } },
          lastUpdated: new Date()
        },
        { new: true }
      );

      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      res.json(profile);
    } catch (error) {
      console.error('Error removing portfolio item:', error);
      res.status(500).json({ message: 'Error removing portfolio item' });
    }
  },

  deleteProfile: async (req, res) => {
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
  },

  getUserBookings: async (req, res) => {
    try {
      const bookings = await Booking.find({
        $or: [
          { customerId: req.auth.userId },
          { professionalId: req.auth.userId }
        ]
      })
      .sort({ date: -1 })
      .populate('professionalId', 'name email phone')
      .populate('customerId', 'name email phone');

      res.json(bookings);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      res.status(500).json({ message: 'Error fetching bookings' });
    }
  }
};

module.exports = profileController; 