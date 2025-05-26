const express = require('express');
const router = express.Router();
const Professional = require('../models/Professional');
const Booking = require('../models/Booking');
const { generateAIResponse } = require('../utils/aiService');
const Notification = require('../models/Notification');

// Get professional dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const professional = await Professional.findOne({ userId: req.user.id });
    if (!professional) {
      return res.status(404).json({ message: 'Professional not found' });
    }

    const bookings = await Booking.find({ professionalId: professional._id });
    const stats = {
      totalBookings: bookings.length,
      totalEarnings: bookings.reduce((sum, booking) => sum + booking.amount, 0),
      averageRating: professional.rating || 0,
      completedBookings: bookings.filter(b => b.status === 'completed').length
    };

    const recentBookings = await Booking.find({ professionalId: professional._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('clientId', 'name email phone');

    res.json({ stats, recentBookings });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Failed to load dashboard data' });
  }
});

// Get professional bookings
router.get('/bookings', async (req, res) => {
  try {
    const professional = await Professional.findOne({ userId: req.user.id });
    if (!professional) {
      return res.status(404).json({ message: 'Professional not found' });
    }

    const bookings = await Booking.find({ professionalId: professional._id })
      .populate('clientId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Bookings error:', error);
    res.status(500).json({ message: 'Failed to load bookings' });
  }
});

// Update booking status
router.patch('/bookings/:bookingId', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.bookingId)
      .populate('clientId', 'name email phone')
      .populate('professionalId', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    // Create notifications for both client and professional
    if (status === 'confirmed') {
      // Notification for client
      await Notification.create({
        userId: booking.clientId._id,
        title: 'Booking Confirmed',
        message: `Your booking for ${booking.service} has been confirmed for ${booking.date}`,
        type: 'booking',
        relatedId: booking._id
      });

      // Notification for professional
      await Notification.create({
        userId: booking.professionalId._id,
        title: 'New Booking Confirmed',
        message: `You have a new confirmed booking for ${booking.service} on ${booking.date}`,
        type: 'booking',
        relatedId: booking._id
      });
    }

    res.json(booking);
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Failed to update booking' });
  }
});

// Get notifications
router.get('/notifications', async (req, res) => {
  try {
    const professional = await Professional.findOne({ userId: req.user.id });
    if (!professional) {
      return res.status(404).json({ message: 'Professional not found' });
    }

    const notifications = await Notification.find({ userId: professional._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    console.error('Notifications error:', error);
    res.status(500).json({ message: 'Failed to load notifications' });
  }
});

// Mark notification as read
router.patch('/notifications/:notificationId', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    console.error('Update notification error:', error);
    res.status(500).json({ message: 'Failed to update notification' });
  }
});

// AI Query endpoint
router.post('/ai-query', async (req, res) => {
  try {
    const { query } = req.body;
    const professional = await Professional.findOne({ userId: req.user.id });
    
    if (!professional) {
      return res.status(404).json({ message: 'Professional not found' });
    }

    const aiResponse = await generateAIResponse(query, professional);
    
    // Save AI interaction to database
    await AIInteraction.create({
      professionalId: professional._id,
      query,
      response: aiResponse,
      category: professional.type
    });

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('AI query error:', error);
    res.status(500).json({ message: 'Failed to process AI query' });
  }
});

module.exports = router; 