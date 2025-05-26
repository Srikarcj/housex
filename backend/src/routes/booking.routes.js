const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const UserProfile = require('../models/UserProfile');

// Get all bookings for the authenticated user
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'schedule', sortOrder = 'desc' } = req.query;
    const skip = (page - 1) * limit;

    const bookings = await Booking.find({
      $or: [
        { customerId: req.auth.userId },
        { professionalId: req.auth.userId }
      ]
    })
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('professionalId', 'firstName lastName email phone')
    .populate('customerId', 'firstName lastName email phone');

    const total = await Booking.countDocuments({
      $or: [
        { customerId: req.auth.userId },
        { professionalId: req.auth.userId }
      ]
    });

    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Create a new booking
router.post('/', async (req, res) => {
  try {
    console.log('Received booking request:', JSON.stringify(req.body, null, 2));
    
    const {
      professionalId,
      serviceType,
      schedule,
      duration,
      location,
      notes,
      contactInfo
    } = req.body;

    // Validate required fields
    const requiredFields = ['serviceType', 'schedule', 'duration', 'location', 'contactInfo'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({ 
        message: 'Missing required fields',
        missingFields: missingFields
      });
    }

    // Check if professional exists
    const professional = await UserProfile.findOne({ 
      userId: professionalId,
      accountType: 'painter'
    });

    if (!professional) {
      console.error('Professional not found:', professionalId);
      return res.status(404).json({ 
        message: 'Professional not found',
        details: 'The selected professional is not available'
      });
    }

    // Create booking
    const booking = new Booking({
      customerId: req.auth.userId,
      professionalId,
      serviceType,
      schedule: new Date(schedule),
      duration,
      location,
      notes,
      status: 'pending',
      createdAt: new Date()
    });

    console.log('Saving booking:', JSON.stringify(booking, null, 2));
    await booking.save();
    console.log('Booking saved successfully');

    // Update both profiles with the booking
    await UserProfile.findOneAndUpdate(
      { userId: req.auth.userId },
      { $push: { bookings: booking._id } }
    );

    await UserProfile.findOneAndUpdate(
      { userId: professionalId },
      { $push: { bookings: booking._id } }
    );

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ 
      message: 'Error creating booking',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get a specific booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('professionalId', 'firstName lastName email phone')
      .populate('customerId', 'firstName lastName email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to view this booking
    if (booking.customerId.userId !== req.auth.userId && 
        booking.professionalId.userId !== req.auth.userId) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Error fetching booking' });
  }
});

// Update booking status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to update this booking
    if (booking.customerId.toString() !== req.auth.userId && 
        booking.professionalId.toString() !== req.auth.userId) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    booking.lastUpdated = new Date();
    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Error updating booking' });
  }
});

// Delete a booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to delete this booking
    if (booking.customerId.toString() !== req.auth.userId && 
        booking.professionalId.toString() !== req.auth.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }

    // Remove booking from both profiles
    await UserProfile.findOneAndUpdate(
      { userId: booking.customerId },
      { $pull: { bookings: booking._id } }
    );

    await UserProfile.findOneAndUpdate(
      { userId: booking.professionalId },
      { $pull: { bookings: booking._id } }
    );

    await booking.remove();

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Error deleting booking' });
  }
});

module.exports = router; 