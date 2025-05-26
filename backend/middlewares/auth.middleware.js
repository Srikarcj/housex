const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const User = require('../models/user.model');

// Middleware to require authentication
const requireAuth = ClerkExpressRequireAuth();

// Middleware to check user role
const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      if (!req.auth || !req.auth.userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const user = await User.findOne({ clerkId: req.auth.userId });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: 'Unauthorized access' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

// Middleware to check if user is the owner of the resource
const checkOwnership = (model) => {
  return async (req, res, next) => {
    try {
      if (!req.auth || !req.auth.userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const resource = await model.findById(req.params.id);
      
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      const user = await User.findOne({ clerkId: req.auth.userId });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if user is admin
      if (user.role === 'admin') {
        req.resource = resource;
        return next();
      }

      // Check ownership based on model type
      if (model.modelName === 'User') {
        if (resource.clerkId !== req.auth.userId) {
          return res.status(403).json({ message: 'Unauthorized access' });
        }
      } else if (model.modelName === 'Booking') {
        if (resource.client.toString() !== user._id.toString() && 
            resource.professional.toString() !== user._id.toString()) {
          return res.status(403).json({ message: 'Unauthorized access' });
        }
      } else if (model.modelName === 'Review') {
        if (resource.client.toString() !== user._id.toString() && 
            resource.professional.toString() !== user._id.toString()) {
          return res.status(403).json({ message: 'Unauthorized access' });
        }
      }

      req.resource = resource;
      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = {
  requireAuth,
  checkRole,
  checkOwnership
}; 