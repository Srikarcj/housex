const express = require('express');
const router = express.Router();
const { auth } = require('@clerk/clerk-sdk-node');
const Booking = require('../models/Booking');
const Professional = require('../models/Professional');
const { validateBooking } = require('../middleware/validation');
const { WebSocketServer } = require('ws');

// WebSocket server for real-time updates
const wss = new WebSocketServer({ port: process.env.WS_PORT || 8080 });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
});

// Broadcast booking updates to all connected clients
const broadcastBookingUpdate = (booking) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'booking_update',
        booking
      }));
    }
  });
};

// Get all bookings for a professional
router.get('/', auth(), async (req, res) => {
  try {
    const professional = await Professional.findOne({ userId: req.auth.userId });
    if (!professional) {
      return res.status(404).json({ message: 'Professional not found' });
    }

    const bookings = await Booking.find({ professionalId: professional._id })
      .sort({ date: 1, time: 1 })
      .populate('clientId', 'name email');

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Create a new booking
router.post('/', auth(), validateBooking, async (req, res) => {
  try {
    const professional = await Professional.findOne({ userId: req.auth.userId });
    if (!professional) {
      return res.status(404).json({ message: 'Professional not found' });
    }

    const booking = new Booking({
      ...req.body,
      professionalId: professional._id,
      clientId: req.auth.userId,
      status: 'pending'
    });

    await booking.save();
    broadcastBookingUpdate(booking);

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
});

// Update booking status
router.patch('/:id/status', auth(), async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const professional = await Professional.findOne({ userId: req.auth.userId });
    if (!professional || booking.professionalId.toString() !== professional._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    await booking.save();
    broadcastBookingUpdate(booking);

    res.json(booking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Error updating booking status' });
  }
});

// Get booking details
router.get('/:id', auth(), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('professionalId', 'name email')
      .populate('clientId', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const professional = await Professional.findOne({ userId: req.auth.userId });
    if (!professional || booking.professionalId.toString() !== professional._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ message: 'Error fetching booking details' });
  }
});

// Cancel booking
router.delete('/:id', auth(), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const professional = await Professional.findOne({ userId: req.auth.userId });
    if (!professional || booking.professionalId.toString() !== professional._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();
    broadcastBookingUpdate(booking);

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Error cancelling booking' });
  }
});

module.exports = router; 