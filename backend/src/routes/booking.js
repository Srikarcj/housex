const express = require('express');
const router = express.Router();
const { Booking, UserProfile } = require('../models/schema');
const { validateRequest } = require('../middleware/auth');
const { Configuration, OpenAIApi } = require('openai');

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

// Create a new booking with advanced options
router.post('/', validateRequest, async (req, res) => {
  try {
    const {
      professionalId,
      serviceType,
      date,
      time,
      duration,
      location,
      description,
      priority,
      recurring,
      customRequirements,
      attachments
    } = req.body;

    // Validate professional exists and is available
    const professional = await UserProfile.findOne({ 
      userId: professionalId,
      isProfessional: true,
      'professionalDetails.services': serviceType
    });

    if (!professional) {
      return res.status(404).json({ error: 'Professional not found or service not offered' });
    }

    // Check availability with advanced scheduling
    const bookingDate = new Date(`${date}T${time}`);
    const endTime = new Date(bookingDate.getTime() + duration * 60000);

    const existingBooking = await Booking.findOne({
      professionalId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          date: bookingDate,
          $or: [
            { time: { $lt: endTime }, endTime: { $gt: bookingDate } },
            { time: { $lt: endTime }, endTime: { $gt: endTime } }
          ]
        }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ error: 'Time slot not available' });
    }

    // Create booking with advanced options
    const booking = new Booking({
      userId: req.auth.userId,
      professionalId,
      serviceType,
      date: bookingDate,
      time: bookingDate,
      endTime,
      duration,
      location,
      description,
      status: 'pending',
      priority: priority || 'normal',
      recurring: recurring || false,
      recurringPattern: recurring ? req.body.recurringPattern : null,
      customRequirements,
      attachments,
      estimatedCost: req.body.estimatedCost,
      paymentStatus: 'pending',
      notes: req.body.notes || []
    });

    await booking.save();

    // Generate AI-powered booking confirmation
    const prompt = `Generate a professional booking confirmation message for a ${serviceType} service scheduled for ${date} at ${time}. Include key details and next steps.`;
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 150
    });

    const confirmationMessage = completion.data.choices[0].text.trim();

    res.status(201).json({
      booking,
      confirmationMessage
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Error creating booking' });
  }
});

// Get booking details with enhanced information
router.get('/:id', validateRequest, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'firstName lastName email phone')
      .populate('professionalId', 'firstName lastName email phone professionalDetails');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Add AI-generated insights
    const prompt = `Analyze this booking for ${booking.serviceType} and provide insights about:
    1. Best preparation steps
    2. Common questions to ask
    3. Potential considerations
    Booking details: ${JSON.stringify(booking)}`;

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 200
    });

    const insights = completion.data.choices[0].text.trim();

    res.json({
      booking,
      insights
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching booking details' });
  }
});

// Update booking with advanced options
router.put('/:id', validateRequest, async (req, res) => {
  try {
    const {
      date,
      time,
      duration,
      status,
      priority,
      customRequirements,
      attachments,
      notes
    } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Update booking with new information
    if (date && time) {
      const newDate = new Date(`${date}T${time}`);
      booking.date = newDate;
      booking.time = newDate;
      booking.endTime = new Date(newDate.getTime() + (duration || booking.duration) * 60000);
    }

    if (duration) booking.duration = duration;
    if (status) booking.status = status;
    if (priority) booking.priority = priority;
    if (customRequirements) booking.customRequirements = customRequirements;
    if (attachments) booking.attachments = attachments;
    if (notes) booking.notes = [...booking.notes, { text: notes, timestamp: new Date() }];

    await booking.save();

    // Generate AI-powered update summary
    const prompt = `Generate a summary of changes made to a ${booking.serviceType} booking. Changes include: ${JSON.stringify(req.body)}`;
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 100
    });

    const updateSummary = completion.data.choices[0].text.trim();

    res.json({
      booking,
      updateSummary
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating booking' });
  }
});

// Get user's booking history with advanced filtering
router.get('/user/history', validateRequest, async (req, res) => {
  try {
    const {
      status,
      serviceType,
      startDate,
      endDate,
      priority,
      page = 1,
      limit = 10
    } = req.query;

    const query = { userId: req.auth.userId };
    if (status) query.status = status;
    if (serviceType) query.serviceType = serviceType;
    if (priority) query.priority = priority;
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const bookings = await Booking.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('professionalId', 'firstName lastName professionalDetails');

    const total = await Booking.countDocuments(query);

    // Generate AI-powered booking history insights
    const prompt = `Analyze this booking history and provide insights about:
    1. Most common service types
    2. Preferred scheduling patterns
    3. Recommendations for future bookings
    Bookings: ${JSON.stringify(bookings)}`;

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 150
    });

    const insights = completion.data.choices[0].text.trim();

    res.json({
      bookings,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      insights
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching booking history' });
  }
});

// Cancel booking with advanced options
router.post('/:id/cancel', validateRequest, async (req, res) => {
  try {
    const { reason, refundRequest } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = reason;
    booking.refundRequested = refundRequest;
    booking.cancelledAt = new Date();

    await booking.save();

    // Generate AI-powered cancellation message
    const prompt = `Generate a professional cancellation message for a ${booking.serviceType} booking. Include reason: ${reason} and refund status: ${refundRequest}`;
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 100
    });

    const cancellationMessage = completion.data.choices[0].text.trim();

    res.json({
      booking,
      cancellationMessage
    });
  } catch (error) {
    res.status(500).json({ error: 'Error cancelling booking' });
  }
});

// Get user's bookings
router.get('/my-bookings', validateRequest, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {
      $or: [
        { customerId: req.auth.userId },
        { professionalId: req.auth.userId }
      ]
    };

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ date: -1, startTime: -1 });

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bookings' });
  }
});

// Get booking details
router.get('/:id', validateRequest, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user is authorized to view this booking
    if (booking.customerId !== req.auth.userId && booking.professionalId !== req.auth.userId) {
      return res.status(403).json({ error: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching booking details' });
  }
});

// Update booking status
router.patch('/:id/status', validateRequest, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user is authorized to update this booking
    if (booking.customerId !== req.auth.userId && booking.professionalId !== req.auth.userId) {
      return res.status(403).json({ error: 'Not authorized to update this booking' });
    }

    booking.status = status;
    booking.updatedAt = new Date();
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Error updating booking status' });
  }
});

// Cancel booking
router.delete('/:id', validateRequest, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user is authorized to cancel this booking
    if (booking.customerId !== req.auth.userId && booking.professionalId !== req.auth.userId) {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }

    // Only allow cancellation of pending or confirmed bookings
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({ error: 'Cannot cancel this booking' });
    }

    booking.status = 'cancelled';
    booking.updatedAt = new Date();
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error cancelling booking' });
  }
});

// Get available time slots
router.get('/available-slots/:professionalId', async (req, res) => {
  try {
    const { date } = req.query;
    const professional = await UserProfile.findOne({
      userId: req.params.professionalId,
      isProfessional: true
    });

    if (!professional) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    // Get day of week
    const dayOfWeek = new Date(date).toLocaleLowerCase();

    // Get professional's availability for the day
    const availability = professional.professionalDetails.availability[dayOfWeek];
    if (!availability) {
      return res.status(400).json({ error: 'Professional not available on this day' });
    }

    // Get booked slots for the day
    const bookedSlots = await Booking.find({
      professionalId: req.params.professionalId,
      date: new Date(date),
      status: { $in: ['pending', 'confirmed'] }
    }).select('startTime endTime');

    // Generate available slots
    const availableSlots = [];
    let currentTime = new Date(`${date}T${availability.start}`);
    const endTime = new Date(`${date}T${availability.end}`);

    while (currentTime < endTime) {
      const slotStart = currentTime.toTimeString().slice(0, 5);
      const slotEnd = new Date(currentTime.getTime() + 30 * 60000).toTimeString().slice(0, 5);

      // Check if slot is booked
      const isBooked = bookedSlots.some(
        booking => booking.startTime <= slotEnd && booking.endTime >= slotStart
      );

      if (!isBooked) {
        availableSlots.push(slotStart);
      }

      currentTime = new Date(currentTime.getTime() + 30 * 60000);
    }

    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching available slots' });
  }
});

module.exports = router; 