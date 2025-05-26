const Review = require('../models/review.model');
const User = require('../models/user.model');
const Booking = require('../models/booking.model');

// Create a new review
const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment, images } = req.body;
    const client = await User.findOne({ clerkId: req.auth.userId });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Check if booking exists and is completed
    const booking = await Booking.findOne({
      _id: bookingId,
      client: client._id,
      status: 'completed'
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not completed' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists for this booking' });
    }

    const review = new Review({
      booking: bookingId,
      client: client._id,
      professional: booking.professional,
      rating,
      comment,
      images
    });

    await review.save();

    // Update professional's average rating
    const professional = await User.findById(booking.professional);
    const reviews = await Review.find({ professional: professional._id });
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    professional.professionalProfile.rating = {
      average: totalRating / reviews.length,
      count: reviews.length
    };

    await professional.save();

    // Populate the review with user details
    await review.populate('client professional', 'profile');

    res.status(201).json(review);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get review details
const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('client professional', 'profile');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update review
const updateReview = async (req, res) => {
  try {
    const { rating, comment, images } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const client = await User.findOne({ clerkId: req.auth.userId });
    
    if (!client || review.client.toString() !== client._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    review.rating = rating;
    review.comment = comment;
    if (images) {
      review.images = images;
    }

    await review.save();

    // Update professional's average rating
    const professional = await User.findById(review.professional);
    const reviews = await Review.find({ professional: professional._id });
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    professional.professionalProfile.rating = {
      average: totalRating / reviews.length,
      count: reviews.length
    };

    await professional.save();

    await review.populate('client professional', 'profile');
    res.json(review);
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get reviews for a professional
const getProfessionalReviews = async (req, res) => {
  try {
    const { professionalId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const reviews = await Review.find({ professional: professionalId })
      .populate('client', 'profile')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ professional: professionalId });

    res.json({
      reviews,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total
    });
  } catch (error) {
    console.error('Get professional reviews error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add/remove helpful vote
const toggleHelpfulVote = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const user = await User.findOne({ clerkId: req.auth.userId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const helpfulIndex = review.helpful.findIndex(
      vote => vote.user.toString() === user._id.toString()
    );

    if (helpfulIndex === -1) {
      review.helpful.push({ user: user._id });
    } else {
      review.helpful.splice(helpfulIndex, 1);
    }

    await review.save();
    res.json({ helpful: review.helpful });
  } catch (error) {
    console.error('Toggle helpful vote error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createReview,
  getReview,
  updateReview,
  getProfessionalReviews,
  toggleHelpfulVote
}; 