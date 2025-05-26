const express = require('express');
const router = express.Router();
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const { requireAuth, checkRole, checkOwnership } = require('../middlewares/auth.middleware');
const bookingController = require('../controllers/booking.controller');
const Booking = require('../models/booking.model');

// Apply Clerk authentication to all routes
router.use(ClerkExpressRequireAuth());

// Get user's bookings with pagination and filtering
router.get('/', requireAuth, bookingController.getUserBookings);

// Get booking details
router.get('/:id', requireAuth, checkOwnership(Booking), bookingController.getBooking);

// Create a new booking
router.post('/', requireAuth, checkRole(['client']), bookingController.createBooking);

// Update booking status
router.put('/:id/status', requireAuth, checkOwnership(Booking), bookingController.updateBookingStatus);

// Get user's bookings (alternative endpoint)
router.get('/user/bookings', requireAuth, bookingController.getUserBookings);

// Search available professionals
router.get('/search/professionals', requireAuth, bookingController.searchProfessionals);

module.exports = router; 