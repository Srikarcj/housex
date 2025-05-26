const { UserProfile } = require('../models/schema');

const accountController = {
  // Get account type selection page
  async getAccountTypePage(req, res) {
    try {
      const userId = req.user.id;
      const profile = await UserProfile.findOne({ userId });

      if (profile) {
        // Redirect to appropriate dashboard based on account type
        switch (profile.userType) {
          case 'client':
            return res.redirect('/client/dashboard');
          case 'painter':
            return res.redirect('/painter/dashboard');
          case 'builder':
            return res.redirect('/builder/dashboard');
          default:
            return res.render('account-type-selection');
        }
      }

      res.render('account-type-selection');
    } catch (error) {
      console.error('Account type page error:', error);
      res.status(500).json({
        success: false,
        error: 'Error loading account type page'
      });
    }
  },

  // Set account type
  async setAccountType(req, res) {
    try {
      const userId = req.user.id;
      const { userType } = req.body;

      if (!['client', 'painter', 'builder'].includes(userType)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid account type'
        });
      }

      let profile = await UserProfile.findOne({ userId });

      if (profile) {
        profile.userType = userType;
        profile.isProfessional = userType !== 'client';
      } else {
        profile = new UserProfile({
          userId,
          userType,
          isProfessional: userType !== 'client'
        });
      }

      await profile.save();

      // Redirect to appropriate dashboard
      switch (userType) {
        case 'client':
          return res.redirect('/client/dashboard');
        case 'painter':
          return res.redirect('/painter/dashboard');
        case 'builder':
          return res.redirect('/builder/dashboard');
      }
    } catch (error) {
      console.error('Set account type error:', error);
      res.status(500).json({
        success: false,
        error: 'Error setting account type'
      });
    }
  },

  // Get client dashboard
  async getClientDashboard(req, res) {
    try {
      const userId = req.user.id;
      const profile = await UserProfile.findOne({ userId });

      if (!profile || profile.userType !== 'client') {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      // Get client's bookings, chats, and other relevant data
      const dashboardData = await getClientDashboardData(userId);

      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      console.error('Client dashboard error:', error);
      res.status(500).json({
        success: false,
        error: 'Error loading client dashboard'
      });
    }
  },

  // Get painter dashboard
  async getPainterDashboard(req, res) {
    try {
      const userId = req.user.id;
      const profile = await UserProfile.findOne({ userId });

      if (!profile || profile.userType !== 'painter') {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      // Get painter's bookings, reviews, and other relevant data
      const dashboardData = await getProfessionalDashboardData(userId, 'painter');

      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      console.error('Painter dashboard error:', error);
      res.status(500).json({
        success: false,
        error: 'Error loading painter dashboard'
      });
    }
  },

  // Get builder dashboard
  async getBuilderDashboard(req, res) {
    try {
      const userId = req.user.id;
      const profile = await UserProfile.findOne({ userId });

      if (!profile || profile.userType !== 'builder') {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      // Get builder's bookings, projects, and other relevant data
      const dashboardData = await getProfessionalDashboardData(userId, 'builder');

      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      console.error('Builder dashboard error:', error);
      res.status(500).json({
        success: false,
        error: 'Error loading builder dashboard'
      });
    }
  }
};

// Helper functions
async function getClientDashboardData(userId) {
  const [
    activeBookings,
    pastBookings,
    unreadMessages,
    savedProfessionals
  ] = await Promise.all([
    Booking.find({ userId, status: { $in: ['pending', 'confirmed', 'in-progress'] } })
      .sort({ date: 1 })
      .limit(5),
    Booking.find({ userId, status: { $in: ['completed', 'cancelled'] } })
      .sort({ date: -1 })
      .limit(5),
    Chat.countDocuments({
      participants: userId,
      'unreadCount.userId': { $gt: 0 }
    }),
    UserProfile.find({
      'professionalDetails.savedBy': userId
    }).select('firstName lastName professionalDetails.businessName professionalDetails.rating')
  ]);

  return {
    activeBookings,
    pastBookings,
    unreadMessages,
    savedProfessionals
  };
}

async function getProfessionalDashboardData(userId, type) {
  const [
    todayBookings,
    upcomingBookings,
    unreadMessages,
    recentReviews,
    earnings
  ] = await Promise.all([
    Booking.find({
      professionalId: userId,
      date: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999)
      }
    }),
    Booking.find({
      professionalId: userId,
      date: { $gt: new Date() },
      status: { $in: ['pending', 'confirmed'] }
    }).sort({ date: 1 }).limit(5),
    Chat.countDocuments({
      participants: userId,
      'unreadCount.userId': { $gt: 0 }
    }),
    UserProfile.findOne({ userId })
      .select('professionalDetails.reviews')
      .slice('professionalDetails.reviews', -5),
    Booking.aggregate([
      {
        $match: {
          professionalId: userId,
          status: 'completed',
          date: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 30))
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$estimatedCost' }
        }
      }
    ])
  ]);

  return {
    todayBookings,
    upcomingBookings,
    unreadMessages,
    recentReviews: recentReviews?.professionalDetails?.reviews || [],
    monthlyEarnings: earnings[0]?.total || 0
  };
}

module.exports = accountController; 