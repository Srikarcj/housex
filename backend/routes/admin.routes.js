const express = require('express');
const router = express.Router();
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

router.use(ClerkExpressRequireAuth());

// Admin dashboard
router.get('/dashboard', (req, res) => {
  res.json({ message: 'Admin dashboard' });
});

module.exports = router; 