const express = require('express');
const router = express.Router();
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// Apply auth middleware to all routes
router.use(ClerkExpressRequireAuth());

// Placeholder routes - implement actual review controller later
router.get('/:professionalId', (req, res) => {
  res.json({ message: 'Get reviews endpoint' });
});

router.post('/:professionalId', (req, res) => {
  res.json({ message: 'Create review endpoint' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Update review endpoint' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete review endpoint' });
});

module.exports = router; 