const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming User model is available

require('dotenv').config(); // Ensure JWT_SECRET is loaded

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and attach to request
      req.user = await User.findById(decoded.user.id).select('-password');

      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Not authorized, token is invalid' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Not authorized, token has expired' });
      }
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
