const User = require('../models/user.model');
const Booking = require('../models/booking.model');
const Review = require('../models/review.model');

// Get admin dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProfessionals = await User.countDocuments({
      role: { $in: ['painter', 'housebuilder'] }
    });
    const totalBookings = await Booking.countDocuments();
    const totalReviews = await Review.countDocuments();

    // Get recent bookings
    const recentBookings = await Booking.find()
      .populate('client professional', 'profile')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get top rated professionals
    const topProfessionals = await User.find({
      role: { $in: ['painter', 'housebuilder'] },
      'professionalProfile.rating.count': { $gt: 0 }
    })
      .select('profile professionalProfile')
      .sort({ 'professionalProfile.rating.average': -1 })
      .limit(5);

    // Get monthly statistics
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    const monthlyBookings = await Booking.countDocuments({
      createdAt: { $gte: firstDayOfMonth }
    });

    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: firstDayOfMonth },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$payment.amount' }
        }
      }
    ]);

    res.json({
      totalUsers,
      totalProfessionals,
      totalBookings,
      totalReviews,
      recentBookings,
      topProfessionals,
      monthlyStats: {
        bookings: monthlyBookings,
        revenue: monthlyRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all users with pagination and filters
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { 'profile.firstName': new RegExp(search, 'i') },
        { 'profile.lastName': new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(query)
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user status (suspend/ban)
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = status;
    await user.save();

    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all bookings with filters
const getBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, dateRange } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (dateRange) {
      const [startDate, endDate] = dateRange.split(',');
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const bookings = await Booking.find(query)
      .populate('client professional', 'profile')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBookings: total
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all reviews with filters
const getReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, rating, dateRange } = req.query;
    const query = {};

    if (rating) {
      query.rating = parseInt(rating);
    }

    if (dateRange) {
      const [startDate, endDate] = dateRange.split(',');
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const reviews = await Review.find(query)
      .populate('client professional', 'profile')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(query);

    res.json({
      reviews,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update professional's average rating
    const professional = await User.findById(review.professional);
    const reviews = await Review.find({ professional: professional._id });
    
    if (reviews.length > 1) {
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0) - review.rating;
      professional.professionalProfile.rating = {
        average: totalRating / (reviews.length - 1),
        count: reviews.length - 1
      };
    } else {
      professional.professionalProfile.rating = {
        average: 0,
        count: 0
      };
    }

    await professional.save();
    await review.remove();

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  getBookings,
  getReviews,
  deleteReview
}; 