const User = require('../models/user.model');
const Booking = require('../models/booking.model');
const Review = require('../models/review.model');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-__v')
      .populate('savedProfessionals', 'profile professionalProfile');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { profile, professionalProfile } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update profile fields
    if (profile) {
      user.profile = { ...user.profile, ...profile };
    }

    // Update professional profile if user is a professional
    if (professionalProfile && (user.role === 'painter' || user.role === 'housebuilder')) {
      user.professionalProfile = { ...user.professionalProfile, ...professionalProfile };
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user dashboard data
const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let dashboardData = {};

    if (user.role === 'client') {
      // Get client's bookings and saved professionals
      const bookings = await Booking.find({ client: user._id })
        .populate('professional', 'profile professionalProfile')
        .sort({ createdAt: -1 });

      dashboardData = {
        bookings,
        savedProfessionals: user.savedProfessionals
      };
    } else if (user.role === 'painter' || user.role === 'housebuilder') {
      // Get professional's bookings, reviews, and profile views
      const bookings = await Booking.find({ professional: user._id })
        .populate('client', 'profile')
        .sort({ createdAt: -1 });

      const reviews = await Review.find({ professional: user._id })
        .populate('client', 'profile')
        .sort({ createdAt: -1 });

      dashboardData = {
        bookings,
        reviews,
        profileViews: user.professionalProfile?.profileViews || 0,
        rating: user.professionalProfile?.rating || { average: 0, count: 0 }
      };
    } else if (user.role === 'admin') {
      // Get admin dashboard data
      const totalUsers = await User.countDocuments();
      const totalProfessionals = await User.countDocuments({ role: { $in: ['painter', 'housebuilder'] } });
      const totalBookings = await Booking.countDocuments();
      const recentBookings = await Booking.find()
        .populate('client professional', 'profile')
        .sort({ createdAt: -1 })
        .limit(10);

      dashboardData = {
        totalUsers,
        totalProfessionals,
        totalBookings,
        recentBookings
      };
    }

    res.json(dashboardData);
  } catch (error) {
    console.error('Get user dashboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Save/unsave professional
const toggleSaveProfessional = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const professionalId = req.params.professionalId;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const professional = await User.findOne({
      _id: professionalId,
      role: { $in: ['painter', 'housebuilder'] }
    });

    if (!professional) {
      return res.status(404).json({ message: 'Professional not found' });
    }

    const savedIndex = user.savedProfessionals.indexOf(professionalId);
    if (savedIndex === -1) {
      user.savedProfessionals.push(professionalId);
    } else {
      user.savedProfessionals.splice(savedIndex, 1);
    }

    await user.save();
    res.json({ savedProfessionals: user.savedProfessionals });
  } catch (error) {
    console.error('Toggle save professional error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update professional availability
const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const user = await User.findById(req.user._id);

    if (!user || (user.role !== 'painter' && user.role !== 'housebuilder')) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    user.professionalProfile.availability = availability;
    await user.save();

    res.json({ availability: user.professionalProfile.availability });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserDashboard,
  toggleSaveProfessional,
  updateAvailability
}; 