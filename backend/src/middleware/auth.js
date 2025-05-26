const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// Clerk authentication middleware
const authenticateUser = ClerkExpressRequireAuth();

// Optional: Add role-based middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.auth) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const userRole = req.auth.userType;
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }

    next();
  };
};

module.exports = {
  authenticateUser,
  requireRole
}; 