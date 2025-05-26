const express = require('express');
const router = express.Router();
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const { requireAuth, checkRole, checkOwnership } = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');
const User = require('../models/user.model');

router.use(ClerkExpressRequireAuth());

// Get user profile
router.get('/profile', (req, res) => {
  res.json({ user: req.auth.userId });
});

// Update user profile
router.put('/profile', (req, res) => {
  res.json({ message: 'Profile updated' });
});

// Get user dashboard
router.get('/dashboard', requireAuth, userController.getUserDashboard);

// Save/unsave professional
router.post('/save-professional/:professionalId', requireAuth, checkRole(['client']), userController.toggleSaveProfessional);

// Update professional availability
router.put('/availability', requireAuth, checkRole(['painter', 'housebuilder']), userController.updateAvailability);

module.exports = router; 