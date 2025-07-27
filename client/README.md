# Green Nest Frontend 🌱

This is the frontend React application for Green Nest, an e-commerce platform specializing in organic products, plants, and eco-friendly goods.

## 🛠️ Technologies Used

- **React** (v19.1.0) - Modern UI library with latest features
- **Vite** (v6.3.5) - Fast build tool and development server
- **Tailwind CSS** (v4.1.7) - Utility-first CSS framework
- **React Router DOM** (v7.6.0) - Client-side routing
- **Axios** (v1.10.0) - HTTP client for API communication
- **React Hot Toast** (v2.5.2) - Beautiful toast notifications
- **Google Generative AI** (v0.24.1) - AI-powered features

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file with required variables:
   ```env
   VITE_BACKEND_URL=http://localhost:4000
   VITE_CURRENCY=$
   VITE_GOOGLE_API_KEY=your_google_ai_api_key
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

The application will run on `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
client/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/          # Images, icons, and static assets
│   ├── components/      # Reusable React components
│   │   ├── seller/      # Seller-specific components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ...
│   ├── context/         # React Context for state management
│   ├── pages/          # Page components
│   │   ├── seller/     # Seller dashboard pages
│   │   ├── Home.jsx
│   │   ├── Cart.jsx
│   │   └── ...
│   ├── config/         # Configuration files
│   ├── App.jsx         # Main application component
│   └── main.jsx        # Application entry point
├── eslint.config.js
├── vite.config.js
└── vercel.json
```

## 🎨 Key Features

### User Interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Components**: React 19 with latest features
- **Navigation**: Dynamic navbar with user authentication states
- **Shopping Cart**: Real-time cart updates and management
- **Product Display**: Grid layouts with detailed product cards

### User Experience
- **Authentication**: Secure login/registration with JWT
- **Profile Management**: Complete user profile with image upload
- **Order Tracking**: Comprehensive order history and status
- **Community Features**: Social posts and community interaction
- **AI Assistant**: Integrated Google AI for plant care advice

### Seller Features
- **Dashboard**: Comprehensive seller management interface
- **Product Management**: Add, edit, and manage products
- **Order Management**: Track and fulfill customer orders
- **User Requests**: Handle product requests from customers
- **Community Moderation**: Manage community posts

## 🔧 Configuration

### Vite Configuration
The project uses Vite with React plugin for fast development and optimized builds.

### ESLint Configuration
Modern ESLint setup with React-specific rules for code quality.

### Tailwind CSS
Latest Tailwind CSS v4 with custom configuration for the project's design system.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
The project includes `vercel.json` for easy Vercel deployment:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Environment Variables for Production
- `VITE_BACKEND_URL`: Your production backend URL
- `VITE_CURRENCY`: Currency symbol
- `VITE_GOOGLE_API_KEY`: Google AI API key

## 🧪 Development Guidelines

### Component Structure
- Use functional components with hooks
- Implement proper error boundaries
- Follow React best practices for performance

### State Management
- Context API for global state
- Local state for component-specific data
- Proper state updates and side effects

### Styling
- Tailwind CSS for styling
- Responsive design principles
- Consistent design system

### API Integration
- Axios for HTTP requests
- Proper error handling
- Loading states and user feedback

## 📝 Contributing

1. Follow the existing code style
2. Use meaningful component and variable names
3. Implement proper error handling
4. Test responsive design on multiple devices
5. Ensure accessibility standards

## 🔗 Related

- [Backend Repository](../server/) - Node.js/Express backend
- [Main Documentation](../README.md) - Complete project documentation
