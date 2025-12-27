const jwt = require('jsonwebtoken');
const User = require('../models/User');

/* =========================
   AUTH PROTECT MIDDLEWARE
========================= */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Support tokens that store the id either at top-level (`{ id }`)
      // or nested under `user` (`{ user: { id } }`) — handle both shapes.
      const userId = decoded.id || (decoded.user && decoded.user.id);

      if (!userId) {
        return res.status(401).json({ message: 'Invalid token payload' });
      }

      req.user = await User.findById(userId).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};

/* =========================
   ROLE BASED ACCESS
========================= */
const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied: insufficient permissions'
      });
    }
    next();
  };
};

/* =========================
   EXPORTS (VERY IMPORTANT)
========================= */
module.exports = {
  protect,
  requireRole
};
