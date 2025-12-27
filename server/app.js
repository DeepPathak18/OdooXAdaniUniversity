// 1. Load environment variables at the very top. This is crucial.
const dotenvResult = require('dotenv').config();

const aiRoutes = require('./routes/ai.routes.js');
const mongoose = require('mongoose');

if (dotenvResult.error) {
  console.error('Error loading .env file:', dotenvResult.error);
} else {
  console.log('Successfully loaded .env file. Parsed variables:', dotenvResult.parsed);
}

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Allow requests from your frontend development server
const corsOptions = {
  origin: 'http://localhost:5174', // or your frontend's port
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// after app.use(express.json())...
app.use("/api/ai", aiRoutes);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// this line to enable your OTP routes
app.use('/api/otp', require('./routes/otp.routes.js'));


const connectDB = require('./config/db');
connectDB();

// Handle other connection events
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB runtime error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

// Mount the auth routes
app.use('/api/auth', require('./routes/auth.routes.js'));
app.use('/api/profile', require('./routes/profile.routes.js'));
app.use('/api/equipment', require('./routes/equipment.routes.js'));
app.use('/api/teams', require('./routes/team.routes.js'));
app.use('/api/users', require('./routes/user.routes.js'));
app.use('/api/workcenters', require('./routes/workcenter.routes.js'));
app.use('/api/requests', require('./routes/request.routes.js'));
app.use('/api/analytics', require('./routes/analytics.routes.js'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));