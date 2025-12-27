const jwt = require('jsonwebtoken');
require('dotenv').config(); // To access environment variables like your JWT secret

/**
 *  Authentication middleware for Express.
 * Verifies the JWT token from the 'Authorization' header.
 * If valid, it attaches the user payload to the request object and calls next().
 * If invalid or not present, it sends a 401 Unauthorized response.
 */
module.exports = function(req, res, next) {
  // 1. Get the token from the request header
  // The standard is 'Authorization': 'Bearer <token>'
  const authHeader = req.header('Authorization');

  // 2. Check if the token exists
  if (!authHeader) {
    console.log('❌ Auth middleware: No Authorization header found.');
    return res.status(401).json({ message: 'Authorization denied. No token provided.' });
  }
  
  // 3. Extract the token from "Bearer <token>"
  const token = authHeader.split(' ')[1];

  if (!token) {
    console.log('❌ Auth middleware: Malformed header. Token not found.');
    return res.status(401).json({ message: 'Authorization denied. Token is malformed.' });
  }

  try {
    // 4. Verify the token using the secret key
    // This will decode the token's payload if the signature is valid.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach the user's payload to the request object
    // Your other routes (like in profile.js) can now access `req.user`
    req.user = decoded.user; // Assuming your payload is { user: { id: '...' } }
    
    console.log(`✅ Auth middleware: Token validated for user ID: ${req.user.id}`);

    // 6. Proceed to the next middleware or the route handler
    next();

  } catch (err) {
    // 7. If token is not valid (e.g., expired, wrong secret), catch the error
    console.error('❌ Auth middleware: Token verification failed.', err.message);
    res.status(401).json({ message: 'Token is not valid.' });
  }
};