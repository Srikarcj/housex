const express = require('express');
const router = express.Router();
const { requireAuth, checkRole, checkOwnership } = require('../middlewares/auth.middleware');
const reviewController = require('../controllers/review.controller');
const Review = require('../models/review.model');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

router.use(ClerkExpressRequireAuth());

// Create a new review
router.post('/', requireAuth, checkRole(['client']), reviewController.createReview);

// Get review details
router.get('/:id', requireAuth, checkOwnership(Review), reviewController.getReview);

// Update review
router.put('/:id', requireAuth, checkOwnership(Review), reviewController.updateReview);

// Get professional's reviews
router.get('/professional/:professionalId', requireAuth, reviewController.getProfessionalReviews);

// Toggle helpful vote
router.post('/:id/helpful', requireAuth, reviewController.toggleHelpfulVote);

// Get all reviews
router.get('/', (req, res) => {
  res.json({ message: 'List of reviews' });
});

// Create review
router.post('/', (req, res) => {
  res.json({ message: 'Review created' });
});

module.exports = router; 