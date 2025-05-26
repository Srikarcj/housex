const { body, validationResult } = require('express-validator');

const validateBooking = [
  body('serviceType')
    .isIn(['interior', 'exterior', 'both'])
    .withMessage('Invalid service type'),

  body('schedule')
    .isISO8601()
    .withMessage('Invalid schedule format')
    .custom((value) => {
      const bookingDate = new Date(value);
      const today = new Date();
      if (bookingDate < today) {
        throw new Error('Booking date cannot be in the past');
      }
      return true;
    }),

  body('duration')
    .isFloat({ min: 0.5, max: 24 })
    .withMessage('Duration must be between 0.5 and 24 hours'),

  body('location')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Location is required'),

  body('contactInfo.type')
    .isIn(['email', 'phone'])
    .withMessage('Contact type must be either email or phone'),

  body('contactInfo.value')
    .notEmpty()
    .withMessage('Contact value is required')
    .custom((value, { req }) => {
      if (req.body.contactInfo.type === 'email') {
        return value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      } else {
        return value.match(/^\+?[\d\s-]{10,}$/);
      }
    })
    .withMessage('Invalid contact information format'),

  body('amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),

  body('notes')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),

  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'completed', 'cancelled'])
    .withMessage('Invalid status'),

  body('priority')
    .optional()
    .isIn(['low', 'normal', 'high'])
    .withMessage('Invalid priority'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }
    next();
  }
];

module.exports = {
  validateBooking
}; 