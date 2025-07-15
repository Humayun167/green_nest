# User Product Request Feature

This feature allows users to submit their own products for review by sellers. Here's how it works:

## For Users:

### How to Submit a Product Request:
1. **Login**: Make sure you're logged in to your account
2. **Navigate**: Go to "Add Product" from the user menu (profile dropdown) or mobile navigation
3. **Fill Details**: Provide product information including:
   - Product name
   - Category
   - Description (one feature per line)
   - Market price
   - Suggested selling price
   - Images (up to 4 images)
4. **Submit**: Click "Submit Request" to send for review

### Track Your Requests:
- Access "My Requests" from the user menu
- View status: Pending, Approved, or Rejected
- See seller feedback and notes
- Check submission and update dates

### Request Status:
- **Pending**: Request is waiting for seller review
- **Approved**: Product has been added to the store and is available for purchase
- **Rejected**: Request was declined with reason provided

## For Sellers:

### Managing User Requests:
1. **Access**: Go to "User Requests" section in seller dashboard
2. **Review**: See all pending requests with user details and product information
3. **Decision**: Choose to either approve or reject each request
4. **Approve**: Product gets automatically added to the store catalog
5. **Reject**: Provide reason for rejection to help users improve
6. **Notes**: Add optional notes for users

### Features:
- View pending requests separately from processed ones
- See user information (name and email)
- Preview all product details and images
- Add seller notes for feedback
- Bulk view of processed requests

## Benefits:

### For Users:
- Contribute products to the marketplace
- Earn recognition when products are approved
- Get feedback from professional sellers
- Help expand product variety

### For Sellers:
- Discover new products through user submissions
- Maintain quality control through approval process
- Expand inventory with minimal effort
- Engage with user community

### For the Platform:
- Increased product variety
- Community engagement
- User-generated content
- Better market coverage

## Technical Implementation:

### Backend:
- New UserProductRequest model with approval workflow
- Secure file upload handling via Cloudinary
- Separate routes for user and seller operations
- Authentication middleware for security

### Frontend:
- Intuitive forms for product submission
- Real-time status tracking
- Responsive design for all devices
- Integrated with existing navigation

### Security:
- User authentication required
- Seller authorization for approvals
- Image upload validation
- Data sanitization and validation
