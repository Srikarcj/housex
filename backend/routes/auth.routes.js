const express = require('express');
const router = express.Router();
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// Public routes
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Protected routes
router.use(ClerkExpressRequireAuth());

module.exports = router; 