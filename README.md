# Green Nest 🌱

Green Nest is a full-stack e-commerce web application specializing in organic products, fresh produce, plants, and eco-friendly goods. The platform provides a seamless shopping experience for customers and comprehensive management tools for sellers.

## 🌟 Features

### Customer Features
- **Product Browsing**: Browse products by categories (Flowers, Fruits, Indoor Plants, Vegetables, etc.)
- **User Authentication**: Secure login and registration system
- **Shopping Cart**: Add, remove, and manage products in cart
- **Address Management**: Save and manage multiple delivery addresses
- **Order Management**: Track order history and status
- **Search & Filter**: Find products easily with search and category filters
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Seller Features
- **Seller Dashboard**: Dedicated seller interface for product management
- **Product Management**: Add, edit, and delete products with image uploads
- **Order Management**: View and manage customer orders
- **Inventory Tracking**: Monitor product stock levels

### Technical Features
- **Image Upload**: Cloudinary integration for product images
- **Payment Processing**: Stripe integration for secure payments
- **Real-time Updates**: Dynamic cart and order updates
- **RESTful API**: Well-structured backend API
- **Database**: MongoDB with Mongoose ODM

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage and management
- **Stripe** - Payment processing
- **Multer** - File upload handling

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

# Server Port
PORT=4000
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
│   │   │   └── ...
│   │   ├── context/       # React Context API
│   │   ├── pages/         # Page components
│   │   │   ├── seller/    # Seller dashboard pages
│   │   │   ├── Home.jsx
│   │   │   ├── Cart.jsx
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
│   │   └── ...
│   ├── middlewares/       # Custom middlewares
│   │   ├── authUser.js
│   │   └── authSeller.js
│   ├── models/           # Database models
│   │   ├── User.js
│   │   ├── product.js
│   │   ├── Order.js
│   │   └── Address.js
│   ├── routes/           # API routes
│   │   ├── userRoute.js
│   │   ├── productRoute.js
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
- `POST /logout` - User logout
- `GET /profile` - Get user profile

### Product Routes (`/api/product`)
- `GET /list` - Get all products
- `GET /single/:id` - Get single product
- `POST /add` - Add new product (seller only)
- `PUT /update/:id` - Update product (seller only)
- `DELETE /delete/:id` - Delete product (seller only)

### Cart Routes (`/api/cart`)
- `GET /get` - Get user cart
- `POST /add` - Add item to cart
- `POST /update` - Update cart item quantity
- `DELETE /remove` - Remove item from cart

### Order Routes (`/api/order`)
- `POST /place` - Place new order
- `GET /userorders` - Get user orders
- `GET /list` - Get all orders (seller only)
- `POST /status` - Update order status (seller only)

### Address Routes (`/api/address`)
- `POST /add` - Add new address
- `GET /list` - Get user addresses
- `DELETE /remove/:id` - Remove address

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

- **🌸 Flowers**: Fresh flowers and flowering plants
- **🍎 Fruits**: Organic and fresh fruits
- **🪴 Indoor Plants**: Houseplants and decorative plants
- **🥬 Vegetables**: Fresh organic vegetables
- **🌿 Herbs**: Cooking and medicinal herbs
- **🌾 Grains**: Organic grains and cereals
- **🥛 Dairy**: Fresh dairy products
- **🍞 Bakery**: Fresh baked goods

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the client application:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `dist` folder to your hosting platform

### Backend Deployment (Heroku/Railway)
1. Set up environment variables on your hosting platform
2. Deploy the server directory
3. Ensure MongoDB connection is configured for production

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

## 🐛 Known Issues

- Ensure all environment variables are properly configured
- MongoDB connection string should be valid
- Cloudinary and Stripe accounts need to be set up with valid API keys

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation for common setup problems

## 🔄 Version History

- **v1.0.0** - Initial release with core e-commerce functionality
- **v1.1.0** - Added seller dashboard and product management
- **v1.2.0** - Integrated payment system and order management

---

**Happy Coding! 🌱✨**
