const Booking = require('../models/booking.model');
const User = require('../models/user.model');
const Review = require('../models/review.model');

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Cache middleware with better error handling
const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl || req.url}`;
    
    try {
      const cachedData = cache.get(key);
      if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
        console.log('Cache hit for key:', key);
        return res.json(cachedData.data);
      }
      console.log('Cache miss for key:', key);
      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { professionalId, serviceType, jobDetails, contactInfo } = req.body;
    const client = await User.findOne({ clerkId: req.auth.userId });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const professional = await User.findOne({
      _id: professionalId,
      role: { $in: ['painter', 'housebuilder'] },
      'professionalProfile.availability': true
    });

    if (!professional) {
      return res.status(404).json({ message: 'Professional not found or unavailable' });
    }

    // Validate contact information
    if (!contactInfo || !contactInfo.type || !contactInfo.value) {
      return res.status(400).json({ message: 'Contact information is required' });
    }

    // Validate contact type and value
    if (contactInfo.type === 'email' && !contactInfo.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (contactInfo.type === 'phone' && !contactInfo.value.match(/^\+?[\d\s-]{10,}$/)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    const booking = new Booking({
      client: client._id,
      professional: professional._id,
      serviceType,
      jobDetails,
      contactInfo,
      status: 'pending'
    });

    await booking.save();
    
    // Populate the booking with user details
    await booking.populate('client professional', 'profile professionalProfile');

    // Send notification based on contact type
    const notificationMessage = `
      Your booking has been successfully created!
      Service: ${serviceType}
      Date: ${jobDetails.preferredDate}
      Time: ${jobDetails.preferredTime}
      Location: ${jobDetails.location.address}
      Duration: ${jobDetails.duration} hours
    `;

    if (contactInfo.type === 'email') {
      // In a real implementation, you would integrate with an email service
      console.log('Email notification:', {
        to: contactInfo.value,
        subject: 'Booking Confirmation',
        message: notificationMessage
      });
    } else {
      // In a real implementation, you would integrate with an SMS service
      console.log('SMS notification:', {
        to: contactInfo.value,
        message: notificationMessage
      });
    }
    
    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get booking details
const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('client professional', 'profile professionalProfile');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const user = await User.findOne({ clerkId: req.auth.userId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is authorized to update the booking
    if (booking.professional.toString() !== user._id.toString() && 
        booking.client.toString() !== user._id.toString() && 
        user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    booking.status = status;
    
    // Update schedule if status is completed
    if (status === 'completed') {
      booking.schedule.actualEndDate = new Date();
    }

    await booking.save();
    await booking.populate('client professional', 'profile professionalProfile');
    
    res.json(booking);
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Performance metrics
const performanceMetrics = {
  totalRequests: 0,
  cacheHits: 0,
  cacheMisses: 0,
  errors: 0,
  avgResponseTime: 0
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const startTime = Date.now();
    const { 
      page = 1, 
      limit = 10, 
      status, 
      sortBy = 'schedule', 
      sortOrder = 'desc',
      search,
      date 
    } = req.query;
    const skip = (page - 1) * limit;

    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Build query
    const query = { 
      $or: [
        { client: user._id },
        { professional: user._id }
      ]
    };

    // Add status filter if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    // Add date filter if provided
    if (date && date !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch (date) {
        case 'today':
          query.schedule = {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          };
          break;
        case 'tomorrow':
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          query.schedule = {
            $gte: tomorrow,
            $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
          };
          break;
        case 'week':
          const nextWeek = new Date(today);
          nextWeek.setDate(nextWeek.getDate() + 7);
          query.schedule = {
            $gte: today,
            $lt: nextWeek
          };
          break;
      }
    }

    // Add search filter if provided
    if (search) {
      query.$or = [
        { serviceType: { $regex: search, $options: 'i' } },
        { 'jobDetails.description': { $regex: search, $options: 'i' } }
      ];
    }

    // Validate sortBy parameter
    const allowedSortFields = ['schedule', 'status', 'serviceType', 'createdAt'];
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'schedule';
    const finalSortOrder = sortOrder === 'asc' ? 1 : -1;

    // Try to get from cache first
    const cacheKey = `bookings:${user._id}:${page}:${limit}:${status}:${sortBy}:${sortOrder}:${search}:${date}`;
    const cachedData = cache.get(cacheKey);
    
    let response;
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      response = cachedData.data;
      performanceMetrics.cacheHits++;
    } else {
      const [bookings, total] = await Promise.all([
        Booking.find(query)
          .sort({ [finalSortBy]: finalSortOrder })
          .skip(skip)
          .limit(parseInt(limit))
        .populate('client professional', 'profile professionalProfile')
          .lean(),
        Booking.countDocuments(query)
      ]);

      response = {
        bookings: bookings || [],
        total: total || 0,
        page: parseInt(page),
        totalPages: Math.ceil((total || 0) / limit),
        hasMore: skip + (bookings?.length || 0) < (total || 0)
      };

      // Cache the response
      cache.set(cacheKey, {
        data: response,
        timestamp: Date.now()
      });
      performanceMetrics.cacheMisses++;
    }

    const timeTaken = Date.now() - startTime;
    performanceMetrics.totalRequests++;
    performanceMetrics.avgResponseTime = (performanceMetrics.avgResponseTime * (performanceMetrics.totalRequests - 1) + timeTaken) / performanceMetrics.totalRequests;

    // Log metrics every 100 requests
    if (performanceMetrics.totalRequests % 100 === 0) {
      console.log('Performance Metrics:', {
        totalRequests: performanceMetrics.totalRequests,
        cacheHits: performanceMetrics.cacheHits,
        cacheMisses: performanceMetrics.cacheMisses,
        errors: performanceMetrics.errors,
        avgResponseTime: `${performanceMetrics.avgResponseTime.toFixed(2)}ms`,
        cacheHitRate: `${((performanceMetrics.cacheHits / performanceMetrics.totalRequests) * 100).toFixed(2)}%`
      });
    }

    res.json(response);
  } catch (error) {
    performanceMetrics.errors++;
    console.error('Error in getUserBookings:', error);
    res.status(500).json({ 
      message: 'Error fetching bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      bookings: [],
      total: 0,
      page: parseInt(req.query.page) || 1,
      totalPages: 0,
      hasMore: false
    });
  }
};

// Search available professionals
const searchProfessionals = async (req, res) => {
  try {
    const { serviceType, location, minRating, maxRate } = req.query;
    
    const query = {
      role: { $in: ['painter', 'housebuilder'] },
      'professionalProfile.availability': true
    };

    if (serviceType) {
      query['professionalProfile.specialties'] = serviceType;
    }

    if (location) {
      query['profile.location.city'] = new RegExp(location, 'i');
    }

    if (minRating) {
      query['professionalProfile.rating.average'] = { $gte: parseFloat(minRating) };
    }

    if (maxRate) {
      query['professionalProfile.rate'] = { $lte: parseFloat(maxRate) };
    }

    const professionals = await User.find(query)
      .select('profile professionalProfile')
      .sort({ 'professionalProfile.rating.average': -1 });

    res.json(professionals);
  } catch (error) {
    console.error('Search professionals error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createBooking,
  getBooking,
  updateBookingStatus,
  getUserBookings,
  searchProfessionals,
  cacheMiddleware
}; 