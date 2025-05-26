const { UserProfile } = require('../models/schema');

const userController = {
  // Create or update user profile
  async createOrUpdateProfile(req, res) {
    try {
      const userId = req.user.id;
      const {
        userType,
        firstName,
        lastName,
        email,
        phone,
        address,
        professionalDetails
      } = req.body;

      // Check if profile exists
      let profile = await UserProfile.findOne({ userId });

      if (profile) {
        // Update existing profile
        Object.assign(profile, {
          userType,
          firstName,
          lastName,
          email,
          phone,
          address,
          professionalDetails,
          lastUpdated: new Date()
        });
      } else {
        // Create new profile
        profile = new UserProfile({
          userId,
          userType,
          firstName,
          lastName,
          email,
          phone,
          address,
          professionalDetails,
          isProfessional: userType !== 'client'
        });
      }

      await profile.save();

      res.json({
        success: true,
        data: profile
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({
        success: false,
        error: 'Error updating profile'
      });
    }
  },

  // Get user profile
  async getProfile(req, res) {
    try {
      const userId = req.user.id;

      const profile = await UserProfile.findOne({ userId });
      if (!profile) {
        return res.status(404).json({
          success: false,
          error: 'Profile not found'
        });
      }

      res.json({
        success: true,
        data: profile
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Error getting profile'
      });
    }
  },

  // Get professional profiles
  async getProfessionals(req, res) {
    try {
      const { type, service, location, rating } = req.query;

      const query = {
        isProfessional: true,
        userType: type || { $in: ['painter', 'builder'] }
      };

      if (service) {
        query['professionalDetails.services'] = service;
      }

      if (location) {
        query['professionalDetails.serviceAreas.city'] = {
          $regex: location,
          $options: 'i'
        };
      }

      if (rating) {
        query['professionalDetails.rating'] = { $gte: parseFloat(rating) };
      }

      const professionals = await UserProfile.find(query)
        .select('-preferences')
        .sort({ 'professionalDetails.rating': -1 });

      res.json({
        success: true,
        data: professionals
      });
    } catch (error) {
      console.error('Get professionals error:', error);
      res.status(500).json({
        success: false,
        error: 'Error getting professionals'
      });
    }
  },

  // Update professional availability
  async updateAvailability(req, res) {
    try {
      const userId = req.user.id;
      const { availability } = req.body;

      const profile = await UserProfile.findOne({ userId });
      if (!profile) {
        return res.status(404).json({
          success: false,
          error: 'Profile not found'
        });
      }

      if (!profile.isProfessional) {
        return res.status(403).json({
          success: false,
          error: 'Only professionals can update availability'
        });
      }

      profile.professionalDetails.availability = availability;
      profile.lastUpdated = new Date();

      await profile.save();

      res.json({
        success: true,
        data: profile
      });
    } catch (error) {
      console.error('Update availability error:', error);
      res.status(500).json({
        success: false,
        error: 'Error updating availability'
      });
    }
  },

  // Add review to professional
  async addReview(req, res) {
    try {
      const { professionalId } = req.params;
      const { rating, comment, serviceType } = req.body;
      const userId = req.user.id;

      const professional = await UserProfile.findOne({ userId: professionalId });
      if (!professional) {
        return res.status(404).json({
          success: false,
          error: 'Professional not found'
        });
      }

      // Add review
      professional.professionalDetails.reviews.push({
        userId,
        rating,
        comment,
        serviceType,
        date: new Date()
      });

      // Update average rating
      const reviews = professional.professionalDetails.reviews;
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      professional.professionalDetails.rating = totalRating / reviews.length;
      professional.professionalDetails.totalReviews = reviews.length;

      await professional.save();

      res.json({
        success: true,
        data: professional
      });
    } catch (error) {
      console.error('Add review error:', error);
      res.status(500).json({
        success: false,
        error: 'Error adding review'
      });
    }
  },

  // Update professional portfolio
  async updatePortfolio(req, res) {
    try {
      const userId = req.user.id;
      const { portfolio } = req.body;

      const profile = await UserProfile.findOne({ userId });
      if (!profile) {
        return res.status(404).json({
          success: false,
          error: 'Profile not found'
        });
      }

      if (!profile.isProfessional) {
        return res.status(403).json({
          success: false,
          error: 'Only professionals can update portfolio'
        });
      }

      profile.professionalDetails.portfolio = portfolio;
      profile.lastUpdated = new Date();

      await profile.save();

      res.json({
        success: true,
        data: profile
      });
    } catch (error) {
      console.error('Update portfolio error:', error);
      res.status(500).json({
        success: false,
        error: 'Error updating portfolio'
      });
    }
  }
};

module.exports = userController; 