// 1. Load environment variables at the very top. This is crucial.
const dotenvResult = require('dotenv').config();
const aiRoutes = require('./routes/ai.js');

if (dotenvResult.error) {
  console.error('Error loading .env file:', dotenvResult.error);
} else {
  console.log('Successfully loaded .env file. Parsed variables:', dotenvResult.parsed);
}

const express = require('express');
const mongoose = require('mongoose');
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
app.use('/api/otp', require('./routes/otp'));

// 2. Add this console log for debugging.
// This will immediately tell us if the variable was loaded from your .env file.
console.log('Attempting to connect with MONGO_URI:', process.env.MONGO_URI);

// 3. Connect to MongoDB
// Note: useNewUrlParser and useUnifiedTopology are no longer needed in recent Mongoose versions.
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch(err => {
    // This provides a clearer error message upon failure
    console.error('❌ MongoDB connection error: Could not connect.');
    process.exit(1);
  });

// Handle other connection events
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB runtime error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

// Mount the auth routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));