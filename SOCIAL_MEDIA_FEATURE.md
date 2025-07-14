# Green Nest - Social Media Feature

This document describes the new social media feature added to the Green Nest application.

## Features Added

### Backend (Server-side)

1. **Post Model** (`server/models/Post.js`)
   - User posts with content and optional images
   - Like system with user tracking
   - Comment system with nested user data
   - Automatic timestamps

2. **Post Controller** (`server/controllers/postController.js`)
   - Create posts with image upload support
   - Get all posts with pagination
   - Get user-specific posts
   - Like/unlike posts
   - Add/delete comments
   - Update/delete posts
   - Full CRUD operations with authorization

3. **Post Routes** (`server/routes/postRoute.js`)
   - Public routes for viewing posts
   - Protected routes for creating/managing posts
   - Image upload middleware integration

4. **Multer Middleware** (`server/middlewares/multer.js`)
   - Image upload handling
   - File size and type validation
   - Cloudinary integration for image storage

### Frontend (Client-side)

1. **Social Context** (`client/src/context/SocialContext.jsx`)
   - State management for posts
   - API integration for all post operations
   - Loading states and error handling
   - Pagination support

2. **Components**
   - **CreatePost** (`client/src/components/social/CreatePost.jsx`)
     - Post creation form with image upload
     - Character limits and validation
     - Real-time preview
   
   - **PostCard** (`client/src/components/social/PostCard.jsx`)
     - Display individual posts
     - Like/unlike functionality
     - Comment system
     - Edit/delete for post owners
     - Time formatting
   
   - **SocialFeed** (`client/src/components/social/SocialFeed.jsx`)
     - Main feed with all posts
     - Infinite scroll with pagination
     - Create post integration

3. **Pages**
   - **SocialMedia** (`client/src/pages/SocialMedia.jsx`)
     - Main community page
     - Public feed for all users
   
   - **MyPosts** (`client/src/pages/MyPosts.jsx`)
     - User's personal posts
     - Post management interface

4. **CommunitySection** (`client/src/components/CommunitySection.jsx`)
   - Homepage section promoting the community
   - Call-to-action buttons
   - Feature highlights

## API Endpoints

### Public Endpoints
- `GET /api/post/all` - Get all posts with pagination
- `GET /api/post/:postId` - Get a specific post

### Protected Endpoints (Require Authentication)
- `POST /api/post/create` - Create a new post
- `GET /api/post/user/:userId?` - Get user posts
- `POST /api/post/:postId/like` - Toggle like on a post
- `POST /api/post/:postId/comment` - Add a comment
- `DELETE /api/post/:postId/comment/:commentId` - Delete a comment
- `PUT /api/post/:postId` - Update a post
- `DELETE /api/post/:postId` - Delete a post

## Navigation

- **Community** - Main social media feed (`/community`)
- **My Posts** - User's personal posts page (`/my-posts`)
- Navigation links added to both desktop and mobile menus
- User dropdown menu includes "My Posts" option

## Features

### For Users
1. **Create Posts** - Share thoughts and images about green living
2. **Interact** - Like and comment on posts
3. **Manage** - Edit or delete their own posts and comments
4. **Browse** - View community posts with pagination

### Technical Features
1. **Image Upload** - Cloudinary integration for image storage
2. **Authentication** - JWT token-based authentication
3. **Real-time Updates** - Immediate UI updates after actions
4. **Responsive Design** - Mobile-friendly interface
5. **Error Handling** - Comprehensive error handling and user feedback
6. **Pagination** - Efficient loading of posts
7. **Authorization** - Users can only edit/delete their own content

## File Structure

```
server/
├── models/Post.js
├── controllers/postController.js
├── routes/postRoute.js
├── middlewares/multer.js
└── server.js (updated with post routes)

client/src/
├── context/SocialContext.jsx
├── components/
│   ├── social/
│   │   ├── CreatePost.jsx
│   │   ├── PostCard.jsx
│   │   └── SocialFeed.jsx
│   ├── CommunitySection.jsx
│   └── Navbar.jsx (updated with navigation)
├── pages/
│   ├── SocialMedia.jsx
│   ├── MyPosts.jsx
│   └── Home.jsx (updated with community section)
└── App.jsx (updated with routes)
```

## Getting Started

1. The backend server automatically includes the new post routes
2. Frontend routes are integrated into the main App.jsx
3. Users can access the community via the navigation menu
4. Authentication is required for posting and interacting with posts

## Dependencies

No new dependencies were added. The feature uses existing packages:
- Cloudinary (for image upload)
- Multer (for file handling)
- JWT (for authentication)
- React (for frontend components)
- Tailwind CSS (for styling)

## Security Features

1. **Authentication Required** - Protected routes require valid JWT tokens
2. **Authorization** - Users can only modify their own content
3. **File Validation** - Image uploads are validated for type and size
4. **Input Sanitization** - Content length limits and validation
5. **CORS Protection** - Proper CORS configuration maintained
