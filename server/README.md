# Backend Setup Instructions

## Quick Setup (No MongoDB Installation Required)

### Option 1: Use MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update the `.env` file with your Atlas connection string:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/user-auth-app?retryWrites=true&w=majority
PORT=5000
```

### Option 2: Install MongoDB Locally
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Install and start MongoDB service
3. The current `.env` file should work with local MongoDB

## Testing the Setup

### Test Environment Variables
```bash
node debug-env.js
```

### Test Database Connection
```bash
node test-connection.js
```

### Test Password Logic (No Database Required)
```bash
node test-logic.js
```

## Starting the Server

```bash
npm start
# or
node index.js
```

## API Endpoints

- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/signin` - Login with existing credentials

## Troubleshooting

### If you get "MongoDB connection failed":
1. Make sure MongoDB is running (if using local installation)
2. Check your connection string in `.env` file
3. Try using MongoDB Atlas instead

### If you get "500 Internal Server Error":
1. Check the backend console for detailed error messages
2. Make sure all dependencies are installed: `npm install`
3. Verify the `.env` file is properly formatted (UTF-8 encoding)

## Dependencies

- express
- mongoose
- bcryptjs
- cors
- dotenv
- jsonwebtoken 