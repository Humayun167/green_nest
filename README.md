# Green Nest 🌱
Live Link: [green-nest-frontend.vercel.app](https://green-nest-frontend.vercel.app/)
Green Nest is a full-stack e-commerce web application specializing in organic products, fresh produce, plants, and eco-friendly goods. The platform provides a seamless shopping experience for customers, comprehensive management tools for sellers, and a vibrant community for eco-conscious individuals.

## 🌟 Features

### Customer Features
- **Product Browsing**: Browse products by categories (Flowers, Fruits, Indoor Plants, Vegetables, etc.)
- **User Authentication**: Secure login and registration system with profile management
- **Shopping Cart**: Add, remove, and manage products in cart with real-time updates
- **Address Management**: Save and manage multiple delivery addresses
- **Order Management**: Track order history and status with detailed order information
- **Search & Filter**: Find products easily with search and category filters
- **User Profile**: Complete profile management with image upload and order history
- **Product Requests**: Submit requests for products not currently available
- **Sales Dashboard**: Track products you've submitted and their sales performance
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Community Features
- **Social Feed**: Share posts about your green journey and eco-friendly lifestyle
- **Post Creation**: Upload images and share tips, reviews, and insights
- **Interactive Engagement**: Like and comment on community posts
- **Personal Posts**: Manage your own posts and track engagement
- **Community Discovery**: Explore posts from other eco-conscious users

### Seller Features
- **Seller Dashboard**: Comprehensive admin interface for business management
- **Product Management**: Add, edit, and delete products with multiple image uploads
- **Order Management**: View and manage customer orders with status updates
- **User Product Requests**: Review and approve/reject product requests from users
- **Community Moderation**: Monitor and manage community posts
- **User Management**: View and manage platform users
- **Inventory Tracking**: Monitor product stock levels and availability
- **Enhanced Analytics**: Detailed order management with enhanced seller insights

### AI Integration
- **AI Assistant**: Ask questions about plants, gardening, and eco-friendly living
- **Smart Recommendations**: Get personalized advice using Google's Generative AI

### Technical Features
- **Image Upload**: Cloudinary integration for product images
- **Payment Processing**: Stripe integration for secure payments
- **Real-time Updates**: Dynamic cart and order updates
- **RESTful API**: Well-structured backend API
- **Database**: MongoDB with Mongoose ODM

## 🛠️ Tech Stack

### Frontend
- **React.js** (v19.1.0) - User interface library
- **Vite** (v6.3.5) - Build tool and development server
- **Tailwind CSS** (v4.1.7) - Utility-first CSS framework
- **React Router DOM** (v7.6.0) - Client-side routing
- **Axios** (v1.10.0) - HTTP client for API requests
- **React Hot Toast** (v2.5.2) - Toast notifications
- **Google Generative AI** (v0.24.1) - AI-powered features

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** (v5.1.0) - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** (v8.15.1) - MongoDB object modeling
- **JWT** (v9.0.2) - JSON Web Tokens for authentication
- **bcryptjs** (v3.0.2) - Password hashing
- **Cloudinary** (v2.6.1) - Image storage and management
- **Stripe** (v18.2.0) - Payment processing
- **Multer** (v2.0.0) - File upload handling
- **CORS** (v2.8.5) - Cross-origin resource sharing
- **Cookie Parser** (v1.4.7) - Cookie parsing middleware

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Humayun167/green_nest.git
cd green_nest
```

### 2. Backend Setup

#### Navigate to server directory
```bash
cd server
```

#### Install dependencies
```bash
npm install
```

#### Environment Variables
Create a `.env` file in the server directory and add the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key

# Frontend URL (for CORS)
FRONTEND_URL=your_frontend_url

# Server Port
PORT=4000

# Google AI Configuration
GOOGLE_API_KEY=your_google_generative_ai_key
```

#### Start the backend server
```bash
# Development mode
npm run server

# Production mode
npm start
```

The server will run on `http://localhost:4000`

### 3. Frontend Setup

#### Navigate to client directory
```bash
cd client
```

#### Install dependencies
```bash
npm install
```

#### Environment Variables
Create a `.env` file in the client directory and add the following variables:

```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:4000

# Currency symbol
VITE_CURRENCY=$

# Google AI API Key (for AI features)
VITE_GOOGLE_API_KEY=your_google_generative_ai_key
```

#### Start the development server
```bash
npm run dev
```

The client will run on `http://localhost:5173`

## 📁 Project Structure

```
green_nest/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── assets/        # Images, icons, and asset configurations
│   │   ├── components/    # Reusable React components
│   │   │   ├── seller/    # Seller-specific components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── BestSeller.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── CommunitySection.jsx
│   │   │   ├── MainBanner.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ...
│   │   ├── context/       # React Context API
│   │   │   └── AppContext.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── seller/    # Seller dashboard pages
│   │   │   │   ├── AddProduct.jsx
│   │   │   │   ├── ProductList.jsx
│   │   │   │   ├── Orders.jsx
│   │   │   │   ├── UserProductRequests.jsx
│   │   │   │   ├── CommunityPosts.jsx
│   │   │   │   ├── AllUsers.jsx
│   │   │   │   └── SellerLayout.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── AllProducts.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   ├── MySalesOrders.jsx
│   │   │   ├── AddProductRequest.jsx
│   │   │   ├── MyProductRequests.jsx
│   │   │   ├── SocialMedia.jsx
│   │   │   ├── MyPosts.jsx
│   │   │   ├── AI.jsx
│   │   │   └── ...
│   │   ├── App.jsx        # Main App component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Backend Node.js application
│   ├── configs/           # Configuration files
│   │   ├── cloudinary.js  # Cloudinary setup
│   │   ├── db.js         # Database connection
│   │   └── multer.js     # File upload configuration
│   ├── controllers/       # Route controllers
│   │   ├── userController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── addressController.js
│   │   ├── sellerController.js
│   │   ├── postController.js
│   │   ├── userProductRequestController.js
│   │   └── ...
│   ├── middlewares/       # Custom middlewares
│   │   ├── authUser.js
│   │   ├── authSeller.js
│   │   └── multer.js
│   ├── models/           # Database models
│   │   ├── User.js
│   │   ├── product.js
│   │   ├── Order.js
│   │   ├── Address.js
│   │   ├── Post.js
│   │   ├── UserProductRequest.js
│   │   └── ...
│   ├── routes/           # API routes
│   │   ├── userRoute.js
│   │   ├── productRoute.js
│   │   ├── cartRoute.js
│   │   ├── orderRoute.js
│   │   ├── addressRoute.js
│   │   ├── sellerRoute.js
│   │   ├── postRoute.js
│   │   ├── userProductRequestRoute.js
│   │   └── ...
│   ├── server.js         # Entry point
│   └── package.json
│
└── README.md
```

## 🎯 API Endpoints

### User Routes (`/api/user`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /is-auth` - Check user authentication
- `GET /logout` - User logout
- `GET /profile` - Get user profile
- `PUT /update-profile` - Update user profile
- `PUT /update-password` - Update user password
- `GET /order-count` - Get user order count
- `POST /upload-image` - Upload profile image

### Product Routes (`/api/product`)
- `GET /list` - Get all products
- `GET /id` - Get single product
- `POST /add` - Add new product (seller only)
- `POST /stock` - Update product stock (seller only)

### Cart Routes (`/api/cart`)
- `POST /update` - Update cart items

### Order Routes (`/api/order`)
- `POST /cod` - Place COD order
- `GET /user` - Get user orders
- `GET /user-sales` - Get user sales orders
- `GET /seller` - Get all orders (seller only)
- `GET /seller-enhanced` - Get enhanced seller orders (seller only)

### Address Routes (`/api/address`)
- `POST /add` - Add new address
- `GET /get` - Get user addresses

### Seller Routes (`/api/seller`)
- `POST /login` - Seller login
- `GET /is-auth` - Check seller authentication
- `GET /logout` - Seller logout
- `GET /users` - Get all users (seller only)

### Post Routes (`/api/post`)
- `GET /all` - Get all posts (public)
- `POST /create` - Create new post (authenticated users)
- `GET /user` - Get user posts
- `GET /user/:userId` - Get posts by specific user
- `GET /:postId` - Get single post
- `POST /:postId/like` - Toggle like on post
- `POST /:postId/comment` - Add comment to post
- `DELETE /:postId/comment/:commentId` - Delete comment
- `PUT /:postId` - Update post
- `DELETE /:postId` - Delete post
- `GET /seller/all` - Get all posts (seller only)
- `DELETE /seller/:postId` - Delete post (seller only)

### User Product Request Routes (`/api/user-product-request`)
- `POST /submit` - Submit product request (authenticated users)
- `GET /user-requests` - Get user's product requests
- `GET /all-requests` - Get all product requests (seller only)
- `POST /approve` - Approve product request (seller only)
- `POST /reject` - Reject product request (seller only)

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

- **User Authentication**: Regular customers can register, login, and access customer features
- **Seller Authentication**: Sellers have access to additional management features
- **Protected Routes**: Certain routes require authentication tokens
- **Cookie-based Storage**: JWT tokens are stored in HTTP-only cookies for security

## 💳 Payment Integration

Green Nest integrates with Stripe for secure payment processing:

- **Secure Checkout**: PCI-compliant payment processing
- **Multiple Payment Methods**: Support for cards and digital wallets
- **Order Confirmation**: Automatic order confirmation after successful payment

## 🖼️ Image Management

Images are handled using Cloudinary:

- **Product Images**: Multiple image uploads per product
- **Image Optimization**: Automatic compression and format optimization
- **CDN Delivery**: Fast image delivery through Cloudinary's CDN

## 🌱 Product Categories

Green Nest specializes in:

- **🌸 Flowers**: Fresh flowers and flowering plants for your home and garden
- **🍎 Fruits**: Organic and fresh fruits sourced from local farms
- **🪴 Indoor Plants**: Houseplants and decorative plants to enhance your living space
- **🥬 Vegetables**: Fresh organic vegetables for healthy eating
- **🌿 Herbs**: Cooking and medicinal herbs for natural wellness
- **🌾 Grains**: Organic grains and cereals for nutritious meals
- **🥛 Dairy**: Fresh dairy products from sustainable sources
- **🍞 Bakery**: Fresh baked goods made with organic ingredients

## 🤖 AI Features

Green Nest includes an AI-powered assistant that helps users with:

- **Plant Care Advice**: Get expert tips on caring for your plants
- **Gardening Guidance**: Learn about sustainable gardening practices
- **Product Recommendations**: Receive personalized eco-friendly product suggestions
- **Eco-Living Tips**: Discover ways to live more sustainably
- **Problem Solving**: Get help with plant diseases, pest control, and more

The AI assistant is powered by Google's Generative AI and provides intelligent, context-aware responses to help users on their green journey.

## 👥 Community Features

Green Nest fosters a vibrant community of eco-conscious individuals:

- **Post Sharing**: Share photos and stories of your green lifestyle
- **Community Feed**: Discover inspiring content from fellow users
- **Engagement**: Like and comment on posts to build connections
- **Sustainability Tips**: Learn from experienced eco-warriors
- **Product Reviews**: Read authentic reviews from community members
- **Environmental Discussions**: Participate in meaningful conversations about sustainability

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the client application:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `dist` folder to your hosting platform
3. Set environment variables:
   - `VITE_BACKEND_URL`: Your backend API URL
   - `VITE_CURRENCY`: Currency symbol (e.g., $)
   - `VITE_GOOGLE_API_KEY`: Google Generative AI API key

### Backend Deployment (Heroku/Railway/Vercel)
1. Set up environment variables on your hosting platform:
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: JWT secret key
   - `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Cloudinary credentials
   - `STRIPE_SECRET_KEY`: Stripe secret key
   - `FRONTEND_URL`: Frontend URL for CORS
   - `GOOGLE_API_KEY`: Google Generative AI API key
   - `PORT`: Server port (optional, defaults to 4000)
2. Deploy the server directory
3. Ensure MongoDB connection is configured for production

### Vercel Configuration
Both client and server include `vercel.json` files for easy Vercel deployment:

**Client** (`client/vercel.json`):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Server** (`server/vercel.json`):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Humayun167** - [GitHub Profile](https://github.com/Humayun167)

## 🐛 Known Issues & Troubleshooting

### Environment Setup
- Ensure all environment variables are properly configured in both client and server
- MongoDB connection string should be valid and accessible
- Cloudinary and Stripe accounts need to be set up with valid API keys
- Google AI API key is required for AI features

### Authentication Issues
- If authentication fails, check JWT secret configuration
- Ensure cookies are enabled in browser for proper session management
- Cross-origin requests require proper CORS configuration

### Image Upload Issues
- Verify Cloudinary credentials are correct
- Check file size limits and supported formats
- Ensure proper multer configuration for file uploads

### Development Tips
- Use the debug routes (`/debug-auth`, `/debug-products`) for troubleshooting
- Check browser console for detailed error messages
- Monitor network requests for API response details

## 📱 Mobile Responsiveness

Green Nest is fully responsive and optimized for:
- **Desktop**: Full-featured experience with advanced navigation
- **Tablet**: Adapted layouts with touch-friendly interfaces
- **Mobile**: Streamlined UI with collapsible menus and optimized interactions

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Secure file handling with Multer
- **Environment Variables**: Sensitive data stored securely

## 🎨 UI/UX Features

- **Modern Design**: Clean, intuitive interface with Tailwind CSS
- **Responsive Navigation**: Adaptive menu system for all devices
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Visual feedback during async operations
- **Error Handling**: Graceful error messages and fallbacks
- **Accessibility**: ARIA labels and semantic HTML structure

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation for common setup problems

## 🔄 Version History

- **v1.0.0** - Initial release with core e-commerce functionality
- **v1.1.0** - Added seller dashboard and product management
- **v1.2.0** - Integrated payment system and order management
- **v1.3.0** - Introduced community features and social posts
- **v1.4.0** - Added user product request system
- **v1.5.0** - Integrated AI assistant with Google Generative AI
- **v1.6.0** - Enhanced seller features and user management
- **v1.7.0** - Improved mobile responsiveness and UI/UX
- **v2.0.0** - Complete platform overhaul with advanced features

## 🚀 Upcoming Features

- **Payment Integration**: Complete Stripe payment processing
- **Real-time Chat**: Customer support and community chat
- **Push Notifications**: Order updates and community alerts
- **Advanced Analytics**: Comprehensive dashboard for sellers
- **Mobile App**: React Native mobile application
- **Multi-language Support**: Internationalization features
- **Advanced Search**: AI-powered product discovery
- **Subscription Service**: Regular product deliveries

## 📊 Performance Optimizations

- **Image Optimization**: Cloudinary automatic optimization
- **Lazy Loading**: Efficient resource loading
- **Code Splitting**: Optimized bundle sizes with Vite
- **Caching**: Strategic caching for improved performance
- **CDN Integration**: Fast global content delivery
- **Database Indexing**: Optimized MongoDB queries

---

**Happy Coding! 🌱✨**
