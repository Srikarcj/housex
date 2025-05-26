const { Booking, UserProfile } = require('../models/schema');
const { createChat } = require('./chatController');

// Simple function to send email notification (mock implementation)
const sendEmailNotification = async (to, subject, message) => {
  // In a real implementation, you would integrate with an email service
  console.log('Email notification:');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('Message:', message);
};

// Simple function to send SMS notification (mock implementation)
const sendSMSNotification = async (to, message) => {
  // In a real implementation, you would integrate with an SMS service
  console.log('SMS notification:');
  console.log('To:', to);
  console.log('Message:', message);
};

const bookingController = {
  // Create a new booking
  async createBooking(req, res) {
    try {
      const {
        professionalId,
        serviceType,
        date,
        time,
        duration,
        location,
        description,
        customRequirements,
        contactInfo
      } = req.body;

      const userId = req.user.id;

      // Check professional availability
      const professional = await UserProfile.findOne({ userId: professionalId });
      if (!professional) {
        return res.status(404).json({
          success: false,
          error: 'Professional not found'
        });
      }

      // Calculate end time
      const startTime = new Date(`${date}T${time}`);
      const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

      // Check if slot is available
      const isAvailable = await checkAvailability(professionalId, startTime, endTime);
      if (!isAvailable) {
        return res.status(400).json({
          success: false,
          error: 'Selected time slot is not available'
        });
      }

      // Create booking
      const booking = await Booking.create({
        userId,
        professionalId,
        serviceType,
        date: startTime,
        time: startTime,
        endTime,
        duration,
        location,
        description,
        customRequirements,
        contactInfo,
        estimatedCost: calculateEstimatedCost(professional, duration)
      });

      // Create chat for the booking
      await createChat({
        participants: [userId, professionalId],
        chatType: 'booking',
        bookingId: booking._id
      });

      // Send notification based on contact type
      const notificationMessage = `
        Your booking has been successfully created!
        Service: ${serviceType}
        Date: ${date}
        Time: ${time}
        Location: ${location}
        Duration: ${duration} hours
      `;

      if (contactInfo.type === 'email') {
        await sendEmailNotification(
          contactInfo.value,
          'Booking Confirmation',
          notificationMessage
        );
      } else {
        await sendSMSNotification(contactInfo.value, notificationMessage);
      }

      // Emit real-time notification
      req.io.to(professionalId).emit('newBooking', {
        bookingId: booking._id,
        userId,
        serviceType,
        date: startTime
      });

      res.status(201).json({
        success: true,
        booking,
        message: 'Booking created successfully'
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({
        success: false,
        error: 'Error creating booking'
      });
    }
  },

  // Update booking status
  async updateBookingStatus(req, res) {
    try {
      const { bookingId } = req.params;
      const { status, notes } = req.body;
      const userId = req.user.id;

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({
          success: false,
          error: 'Booking not found'
        });
      }

      // Check authorization
      if (booking.professionalId !== userId && booking.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to update this booking'
        });
      }

      // Update status
      booking.status = status;
      if (notes) {
        booking.notes.push({
          text: notes,
          timestamp: new Date(),
          userId
        });
      }

      await booking.save();

      // Emit real-time update
      req.io.to(booking.userId).to(booking.professionalId).emit('bookingStatusUpdate', {
        bookingId,
        status,
        notes
      });

      res.json({
        success: true,
        data: booking
      });
    } catch (error) {
      console.error('Booking update error:', error);
      res.status(500).json({
        success: false,
        error: 'Error updating booking'
      });
    }
  },

  // Get user's bookings
  async getUserBookings(req, res) {
    try {
      const userId = req.user.id;
      const { status, type = 'all' } = req.query;

      const query = {};
      if (type === 'client') {
        query.userId = userId;
      } else if (type === 'professional') {
        query.professionalId = userId;
      } else {
        query.$or = [{ userId }, { professionalId: userId }];
      }

      if (status) {
        query.status = status;
      }

      const bookings = await Booking.find(query)
        .sort({ date: -1 })
        .populate('userId', 'firstName lastName')
        .populate('professionalId', 'firstName lastName professionalDetails.businessName');

      res.json({
        success: true,
        data: bookings
      });
    } catch (error) {
      console.error('Get bookings error:', error);
      res.status(500).json({
        success: false,
        error: 'Error getting bookings'
      });
    }
  },

  // Cancel booking
  async cancelBooking(req, res) {
    try {
      const { bookingId } = req.params;
      const { reason } = req.body;
      const userId = req.user.id;

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({
          success: false,
          error: 'Booking not found'
        });
      }

      // Check authorization
      if (booking.professionalId !== userId && booking.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to cancel this booking'
        });
      }

      // Update booking
      booking.status = 'cancelled';
      booking.cancellationReason = reason;
      booking.cancelledAt = new Date();
      booking.refundRequested = true;

      await booking.save();

      // Emit real-time notification
      req.io.to(booking.userId).to(booking.professionalId).emit('bookingCancelled', {
        bookingId,
        reason
      });

      res.json({
        success: true,
        data: booking
      });
    } catch (error) {
      console.error('Booking cancellation error:', error);
      res.status(500).json({
        success: false,
        error: 'Error cancelling booking'
      });
    }
  }
};

// Helper functions
async function checkAvailability(professionalId, startTime, endTime) {
  const conflictingBookings = await Booking.find({
    professionalId,
    status: { $nin: ['cancelled', 'completed'] },
    $or: [
      {
        time: { $lt: endTime },
        endTime: { $gt: startTime }
      }
    ]
  });

  return conflictingBookings.length === 0;
}

function calculateEstimatedCost(professional, duration) {
  const baseRate = professional.professionalDetails.hourlyRate || 0;
  return baseRate * duration;
}

module.exports = bookingController; 