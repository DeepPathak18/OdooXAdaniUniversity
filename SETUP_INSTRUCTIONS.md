# Tech-Tonic Hackathon Application Setup Instructions

## Overview
This is a MERN stack application with comprehensive user authentication, profile management, and dashboard functionality.

## Implemented Features

### ✅ Task 1: Refactored Authentication and User Experience (UX)

#### 1.1: Sanitized Landing Page
- Landing page is now completely stateless for unauthenticated users
- No user-specific information is displayed
- Clean, generic content with Sign In/Sign Up buttons
- Removed all user data caching and display

#### 1.2: Post-Login Redirect and Notification
- Users are automatically redirected to `/dashboard` after successful login
- Success notification appears in bottom-right corner
- Personalized message: "Welcome back, [Username]! You have logged in successfully."
- Notification auto-disappears after 7 seconds
- Matches existing UI theme with green accent color

#### 1.3: Logout Confirmation Message
- Clear logout confirmation message on landing page
- Message: "You have been logged out successfully."
- Appears at top-center of viewport
- Green gradient styling matching the theme

### ✅ Task 2: Fixed Backend Data Persistence

#### Database Connection Improvements
- Enhanced MongoDB connection error handling
- Detailed logging for connection success/failure
- Connection event monitoring (error, disconnect, reconnect)
- Graceful error handling with process exit on connection failure

#### User Model Updates
- Added missing `username` field to User schema
- Added `phoneNumber` and `gender` fields
- Proper field validation and requirements
- Password hashing with bcrypt

#### API Endpoint Fixes
- Fixed signup endpoint to handle all required fields
- Enhanced error logging and validation
- Proper request body parsing and validation
- Comprehensive error responses

### ✅ Task 3: Implemented User Profile Editing

#### Protected Profile Page
- Route `/profile` is now protected (authentication required)
- Unauthenticated users are redirected to login page
- Pre-populated form with current user data

#### Profile Update API
- New PUT endpoint: `/api/profile/me/update`
- User identification via email
- Field validation and sanitization
- Only allows updates to specific fields (firstName, lastName, username, phoneNumber, gender)
- Returns updated user object with 200 OK status

#### Success Notifications
- Toast notification on successful profile update
- Message: "Profile updated successfully!"
- Appears on profile page after update
- Auto-disappears after 5 seconds

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or cloud instance)
- npm or yarn package manager

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in backend directory:
   ```
   MONGO_URI=mongodb://localhost:27017/tech_tonic
   NODE_ENV=development
   PORT=5000
   ```

4. Start MongoDB service (if running locally)

5. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/google` - Google OAuth

### Profile Management
- `GET /api/profile/me?email={email}` - Get user profile
- `PUT /api/profile/me/update` - Update user profile

## Database Schema

### User Model
```javascript
{
  username: String,
  firstName: String,
  lastName: String,
  email: String (required, unique),
  password: String (hashed),
  phoneNumber: String,
  gender: String,
  appwriteId: String,
  timestamps: true
}
```

## Testing the Application

1. **Landing Page**: Visit `/` - should show generic content without user data
2. **Sign Up**: Create a new account - should redirect to dashboard
3. **Dashboard**: Should show success notification and user data
4. **Profile**: Edit profile information - should show success toast
5. **Logout**: Should redirect to landing page with confirmation message

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGO_URI in .env file
   - Verify network connectivity

2. **Profile Update Fails**
   - Check if user is authenticated
   - Verify email is being sent in request
   - Check backend logs for detailed errors

3. **Frontend Build Errors**
   - Clear node_modules and reinstall
   - Check for missing dependencies
   - Verify React version compatibility

## Security Features

- Password hashing with bcrypt
- Protected routes for authenticated users
- Input validation and sanitization
- Secure session management
- CORS configuration for API access

## Performance Optimizations

- Efficient database queries
- Optimized React component rendering
- Minimal API calls
- Responsive design for mobile devices
