# User Login Troubleshooting Guide

## Issue: Users cannot login to the Green Nest application

### Quick Diagnosis Steps

1. **Access the Auth Debugger**
   - Navigate to `http://localhost:5173/debug-auth` in your browser
   - Click "Run Connectivity Tests" to check server connectivity
   - Review the test results for any failures

2. **Check Browser Console**
   - Open browser developer tools (F12)
   - Go to Console tab
   - Look for any error messages when attempting to login

3. **Verify Server Status**
   - Ensure backend server is running on port 4000
   - Check terminal for any error messages
   - Try accessing `http://localhost:4000` directly

### Common Issues and Solutions

#### 1. Backend Server Not Running
**Symptoms**: "Network Error" or server connectivity test fails
**Solution**: 
```bash
cd d:\Final\green_nest\server
npm start
```

#### 2. Database Connection Issues
**Symptoms**: Server starts but authentication fails
**Solution**: 
- Check MongoDB connection string in `.env` file
- Verify database is accessible
- Check server console for database connection errors

#### 3. CORS Issues
**Symptoms**: Login request blocked by CORS policy
**Solution**: 
- Frontend URL (localhost:5173) should be in allowed origins
- Check server console for CORS-related errors
- Verify `credentials: true` is set in CORS config

#### 4. JWT Secret Missing
**Symptoms**: "jwt must be provided" or token verification errors
**Solution**: 
- Ensure `JWT_SECRET` is set in server `.env` file
- Current value: `JWT_SECRET = "secret#text"`

#### 5. Cookie/Token Issues
**Symptoms**: User gets logged out immediately after login
**Solutions**: 
- Clear browser cookies and localStorage
- Check if tokens are being stored (use Auth Debugger)
- Try using the "Clear localStorage Token" button in debugger

#### 6. Frontend-Backend URL Mismatch
**Symptoms**: API calls fail or go to wrong URL
**Solution**: 
- Verify `VITE_BACKEND_URL` in client `.env` file
- Current value should be: `VITE_BACKEND_URL = "http://localhost:4000"`

### Step-by-Step Debugging Process

1. **Start Backend Server**
   ```bash
   cd d:\Final\green_nest\server
   npm start
   ```
   - Should see: "server is running on http://localhost:4000"
   - Should see: "MongoDB connected"

2. **Start Frontend Server**
   ```bash
   cd d:\Final\green_nest\client
   npm run dev
   ```
   - Should see: "Local: http://localhost:5173/"

3. **Test Server Connectivity**
   - Navigate to: `http://localhost:5173/debug-auth`
   - Click "Run Connectivity Tests"
   - All tests should pass (green)

4. **Test Login Process**
   - Try to login with existing credentials
   - Check browser console for error messages
   - Use Auth Debugger "Test Login API" button

5. **Check Authentication Flow**
   - After login, user should be set in state
   - Token should be stored in localStorage
   - User should stay logged in on page refresh

### Enhanced Features Added

#### Backend Improvements
1. **Enhanced Authentication Middleware**
   - Now supports both cookies and Authorization headers
   - Better error messages for debugging

2. **Improved Login Response**
   - Returns user ID and cart items
   - Provides token for localStorage storage
   - Better error messages

3. **Enhanced User Controller**
   - More detailed error logging
   - Consistent response format

#### Frontend Improvements
1. **Enhanced AppContext**
   - Added logout function with proper cleanup
   - Better error handling in fetchUser
   - Console logging for debugging

2. **Improved Login Component**
   - Token storage in localStorage as fallback
   - Better error handling and user feedback
   - Console logging for debugging

3. **Auth Debugger Component**
   - Comprehensive testing tools
   - Real-time system status
   - Easy troubleshooting actions

### Testing Credentials

You can create a test account using the registration form, or if you have an existing account, use those credentials.

### Advanced Troubleshooting

1. **Check Network Tab**
   - Open browser dev tools → Network tab
   - Attempt login and watch for failed requests
   - Check request/response details

2. **Verify Database Data**
   - Check if user exists in MongoDB
   - Verify password is properly hashed
   - Ensure user collection has required fields

3. **Test API Directly**
   - Use Postman or similar tool
   - Test: `POST http://localhost:4000/api/user/login`
   - Body: `{"email": "test@example.com", "password": "password"}`

### Environment Variables Checklist

**Server (.env)**
- ✅ JWT_SECRET = "secret#text"
- ✅ NODE_ENV = "development"
- ✅ MONGODB_URI = [your MongoDB connection string]
- ✅ CLOUDINARY_* variables for image upload

**Client (.env)**
- ✅ VITE_CURRENCY = '৳'
- ✅ VITE_BACKEND_URL = "http://localhost:4000"

### If All Else Fails

1. Clear all browser data (cookies, localStorage, cache)
2. Restart both frontend and backend servers
3. Check if MongoDB is running and accessible
4. Try creating a new user account instead of logging in
5. Check server and client terminal outputs for any error messages

### Contact Support

If the issue persists after following these steps:
1. Provide the output from the Auth Debugger
2. Share browser console error messages
3. Include server terminal output
4. Describe the exact steps that lead to the error
