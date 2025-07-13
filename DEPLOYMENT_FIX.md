# Vercel Deployment Fix for "No token, authorization denied" Error

## Problem
After deploying to Vercel, sellers cannot add products and receive "No token, authorization denied" error. This happens because of cross-origin cookie handling issues between the frontend and backend domains.

## Root Cause
1. **Cross-Origin Cookies**: When frontend and backend are on different domains (common in Vercel deployments), browsers restrict cookie transmission
2. **SameSite Policy**: Strict SameSite cookie settings prevent cross-origin cookie sharing
3. **CORS Configuration**: Inadequate CORS setup for production environments

## Solutions Implemented

### 1. Updated CORS Configuration
- Added dynamic origin validation
- Enabled credentials for cross-origin requests
- Added support for all Vercel deployment URLs
- Updated cookie SameSite policy to 'None' for production

### 2. Enhanced Cookie Configuration
- Set `sameSite: 'None'` for production (allows cross-origin cookies)
- Ensured `secure: true` for HTTPS environments
- Added proper domain handling

### 3. Added Fallback Authentication
- Implemented Authorization header support as fallback
- Added axios interceptors for automatic token inclusion
- Enhanced debugging logs for production troubleshooting

## Environment Variables Required

### Backend (.env)
```env
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
SELLER_EMAIL=your_seller_email
SELLER_PASSWORD=your_seller_password
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Frontend (.env)
```env
VITE_BACKEND_URL=https://your-backend-domain.vercel.app
VITE_CURRENCY=₹
```

## Deployment Steps

### Backend Deployment (Vercel)
1. Deploy the server folder to Vercel
2. Set all environment variables in Vercel dashboard
3. Ensure `NODE_ENV=production` is set
4. Add your frontend URL to `FRONTEND_URL` environment variable

### Frontend Deployment (Vercel)
1. Deploy the client folder to Vercel
2. Set `VITE_BACKEND_URL` to your backend Vercel URL
3. Ensure HTTPS is enabled (automatic on Vercel)

## Troubleshooting

### Check Browser Console
- Look for CORS errors
- Check if cookies are being set
- Verify network requests show proper headers

### Check Server Logs
The updated middleware now provides detailed logs:
- Cookie presence and values
- Token verification status
- CORS origin validation

### Common Issues and Fixes

1. **Cookies not being sent**
   - Verify `withCredentials: true` in axios config
   - Check SameSite and Secure cookie settings
   - Ensure HTTPS is used in production

2. **CORS errors**
   - Add your exact frontend URL to allowed origins
   - Verify CORS credentials are enabled
   - Check preflight OPTIONS requests

3. **Token validation failing**
   - Verify JWT_SECRET matches between environments
   - Check token expiration
   - Ensure seller email/password match environment variables

### Testing Authentication
To test if the fix works:
1. Log in as seller on the deployed site
2. Try to add a product
3. Check browser developer tools for any errors
4. Verify the request includes either cookies or Authorization header

## Alternative Solutions

If cookies still don't work:
1. The code now supports Authorization headers as fallback
2. Tokens are logged for debugging
3. Enhanced error messages help identify issues

## Files Modified
- `server/server.js` - CORS configuration
- `server/middlewares/authSeller.js` - Enhanced authentication
- `server/controllers/sellerController.js` - Cookie configuration
- `server/controllers/userController.js` - Cookie configuration
- `client/src/context/AppContext.jsx` - Axios interceptors
- `client/src/components/seller/SellerLogin.jsx` - Token handling
- `client/src/pages/seller/SellerLayout.jsx` - Logout handling

## Verification
After deployment, the seller should be able to:
1. Log in successfully
2. Access seller dashboard
3. Add products without authentication errors
4. View orders and manage products

The fixes ensure cross-origin authentication works reliably in production environments.
