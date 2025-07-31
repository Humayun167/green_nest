# Green Nest API Documentation

## Base URL
- **Development**: `http://localhost:4000`
- **Production**: `https://your-backend-url.vercel.app`

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Tokens are sent via HTTP-only cookies for security.

### Authentication Headers (Fallback)
```
Authorization: Bearer <token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": boolean,
  "message": "string",
  "data": object | array | null
}
```

## Error Handling
Error responses include appropriate HTTP status codes and error messages:
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## User Routes (`/api/user`)

### POST `/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6 characters)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "profileImage": "string"
  },
  "token": "string"
}
```

### POST `/login`
User login with email and password.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "profileImage": "string",
    "cartItems": "object"
  },
  "token": "string"
}
```

### GET `/is-auth`
Check if user is authenticated.

**Headers:** `Authorization: Bearer <token>` (or cookie)

**Response:**
```json
{
  "success": true,
  "message": "User authenticated",
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "profileImage": "string",
    "cartItems": "object"
  }
}
```

### GET `/logout`
Logout user and clear authentication.

**Headers:** `Authorization: Bearer <token>` (or cookie)

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### PUT `/update-profile`
Update user profile information.

**Headers:** `Authorization: Bearer <token>` (or cookie)

**Request Body:**
```json
{
  "name": "string (optional)",
  "email": "string (optional)"
}
```

### PUT `/update-password`
Update user password.

**Headers:** `Authorization: Bearer <token>` (or cookie)

**Request Body:**
```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (required, min 6 characters)"
}
```

### GET `/order-count`
Get user's total order count.

**Headers:** `Authorization: Bearer <token>` (or cookie)

**Response:**
```json
{
  "success": true,
  "count": "number"
}
```

### POST `/upload-image`
Upload user profile image.

**Headers:** `Authorization: Bearer <token>` (or cookie)

**Request:** Multipart form data with `image` field

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "imageUrl": "string"
}
```

---

## Product Routes (`/api/product`)

### GET `/list`
Get all products (public endpoint).

**Query Parameters:**
- `category` (optional): Filter by category
- `inStock` (optional): Filter by stock status

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "_id": "string",
      "name": "string",
      "category": "string",
      "price": "number",
      "image": ["string"],
      "description": "string",
      "inStock": "boolean",
      "seller": "string"
    }
  ]
}
```

### GET `/id`
Get single product by ID.

**Query Parameters:**
- `id` (required): Product ID

**Response:**
```json
{
  "success": true,
  "product": {
    "_id": "string",
    "name": "string",
    "category": "string",
    "price": "number",
    "image": ["string"],
    "description": ["string"],
    "inStock": "boolean",
    "seller": "string"
  }
}
```

### POST `/add` (Seller Only)
Add new product.

**Headers:** `Authorization: Bearer <seller-token>` (or cookie)

**Request:** Multipart form data
- `images`: Product images (multiple files)
- `name`: Product name
- `category`: Product category
- `price`: Product price
- `description`: Product description (array)

**Response:**
```json
{
  "success": true,
  "message": "Product added successfully",
  "product": {
    "_id": "string",
    "name": "string",
    "category": "string",
    "price": "number",
    "image": ["string"],
    "description": ["string"],
    "inStock": "boolean",
    "seller": "string"
  }
}
```

### POST `/stock` (Seller Only)
Update product stock status.

**Headers:** `Authorization: Bearer <seller-token>` (or cookie)

**Request Body:**
```json
{
  "productId": "string (required)",
  "inStock": "boolean (required)"
}
```

---

## Cart Routes (`/api/cart`)

### POST `/update`
Update cart items.

**Headers:** `Authorization: Bearer <token>` (or cookie)

**Request Body:**
```json
{
  "cartItems": {
    "productId": "quantity",
    "productId2": "quantity"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart updated successfully"
}
```

---

## Order Routes (`/api/order`)

### POST `/cod`
Place Cash on Delivery order.

**Headers:** `Authorization: Bearer <token>` (or cookie)

**Request Body:**
```json
{
  "items": [
    {
      "productId": "string",
      "quantity": "number"
    }
  ],
  "address": "string (address ID)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "order": {
    "_id": "string",
    "userId": "string",
    "items": "array",
    "amount": "number",
    "address": "object",
    "status": "string",
    "date": "date"
  }
}
```

### GET `/user`
Get user's orders.

**Headers:** `Authorization: Bearer <token>` (or cookie)

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "string",
      "userId": "string",
      "items": "array",
      "amount": "number",
      "address": "object",
      "status": "string",
      "date": "date"
    }
  ]
}
```

### GET `/user-sales`
Get user's sales orders (products they submitted).

**Headers:** `Authorization: Bearer <token>` (or cookie)

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "string",
      "items": "array",
      "amount": "number",
      "status": "string",
      "date": "date",
      "customer": "object"
    }
  ]
}
```

### GET `/seller` (Seller Only)
Get all orders for seller dashboard.

**Headers:** `Authorization: Bearer <seller-token>` (or cookie)

### GET `/seller-enhanced` (Seller Only)
Get enhanced order analytics for sellers.

**Headers:** `Authorization: Bearer <seller-token>` (or cookie)

---

## Address Routes (`/api/address`)

### POST `/add`
Add new delivery address.

**Headers:** `Authorization: Bearer <token>` (or cookie)

**Request Body:**
```json
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "email": "string (required)",
  "street": "string (required)",
  "city": "string (required)",
  "state": "string (required)",
  "zipcode": "string (required)",
  "country": "string (required)",
  "phone": "string (required)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Address added successfully",
  "address": {
    "_id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "street": "string",
    "city": "string",
    "state": "string",
    "zipcode": "string",
    "country": "string",
    "phone": "string"
  }
}
```

### GET `/get`
Get user's saved addresses.

**Headers:** `Authorization: Bearer <token>` (or cookie)

**Response:**
```json
{
  "success": true,
  "addresses": [
    {
      "_id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "street": "string",
      "city": "string",
      "state": "string",
      "zipcode": "string",
      "country": "string",
      "phone": "string"
    }
  ]
}
```

### DELETE `/delete/:id`
Delete a specific address.

**Headers:** `Authorization: Bearer <token>` (or cookie)

**URL Parameters:**
- `id` (string, required): The ID of the address to delete

**Response:**
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Address not found" | "Unauthorized to delete this address"
}
```

---

## Seller Routes (`/api/seller`)

### POST `/login`
Seller login.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Seller login successful",
  "token": "string"
}
```

### GET `/is-auth`
Check seller authentication.

**Headers:** `Authorization: Bearer <seller-token>` (or cookie)

### GET `/logout`
Seller logout.

**Headers:** `Authorization: Bearer <seller-token>` (or cookie)

### GET `/users` (Seller Only)
Get all platform users.

**Headers:** `Authorization: Bearer <seller-token>` (or cookie)

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of users per page

---

## Post Routes (`/api/post`)

### GET `/all`
Get all community posts (public).

**Response:**
```json
{
  "success": true,
  "posts": [
    {
      "_id": "string",
      "user": {
        "_id": "string",
        "name": "string",
        "profileImage": "string"
      },
      "content": "string",
      "image": "string",
      "likes": ["string"],
      "comments": [
        {
          "_id": "string",
          "user": "object",
          "text": "string",
          "createdAt": "date"
        }
      ],
      "createdAt": "date"
    }
  ]
}
```

### POST `/create`
Create new community post.

**Headers:** `Authorization: Bearer <token>` (or cookie)

**Request:** Multipart form data
- `image`: Post image (optional)
- `content`: Post content text

**Response:**
```json
{
  "success": true,
  "message": "Post created successfully",
  "post": {
    "_id": "string",
    "user": "string",
    "content": "string",
    "image": "string",
    "likes": [],
    "comments": [],
    "createdAt": "date"
  }
}
```

### GET `/user`
Get current user's posts.

**Headers:** `Authorization: Bearer <token>` (or cookie)

### GET `/user/:userId`
Get posts by specific user.

**Headers:** `Authorization: Bearer <token>` (or cookie)

### GET `/:postId`
Get single post by ID.

### POST `/:postId/like`
Toggle like on post.

**Headers:** `Authorization: Bearer <token>` (or cookie)

### POST `/:postId/comment`
Add comment to post.

**Headers:** `Authorization: Bearer <token>` (or cookie)

**Request Body:**
```json
{
  "text": "string (required)"
}
```

### DELETE `/:postId/comment/:commentId`
Delete comment from post.

**Headers:** `Authorization: Bearer <token>` (or cookie)

### PUT `/:postId`
Update post.

**Headers:** `Authorization: Bearer <token>` (or cookie)

### DELETE `/:postId`
Delete post.

**Headers:** `Authorization: Bearer <token>` (or cookie)

### GET `/seller/all` (Seller Only)
Get all posts for moderation.

**Headers:** `Authorization: Bearer <seller-token>` (or cookie)

### DELETE `/seller/:postId` (Seller Only)
Delete post as moderator.

**Headers:** `Authorization: Bearer <seller-token>` (or cookie)

---

## User Product Request Routes (`/api/user-product-request`)

### POST `/submit`
Submit product request.

**Headers:** `Authorization: Bearer <token>` (or cookie)

**Request:** Multipart form data
- `images`: Product images (multiple files)
- `name`: Product name
- `category`: Product category
- `expectedPrice`: Expected price
- `description`: Product description
- `reason`: Reason for request

**Response:**
```json
{
  "success": true,
  "message": "Product request submitted successfully",
  "request": {
    "_id": "string",
    "user": "string",
    "name": "string",
    "category": "string",
    "expectedPrice": "number",
    "description": "string",
    "reason": "string",
    "image": ["string"],
    "status": "pending",
    "createdAt": "date"
  }
}
```

### GET `/user-requests`
Get user's product requests.

**Headers:** `Authorization: Bearer <token>` (or cookie)

**Response:**
```json
{
  "success": true,
  "requests": [
    {
      "_id": "string",
      "name": "string",
      "category": "string",
      "expectedPrice": "number",
      "description": "string",
      "image": ["string"],
      "status": "string",
      "sellerNotes": "string",
      "rejectionReason": "string",
      "createdAt": "date"
    }
  ]
}
```

### GET `/all-requests` (Seller Only)
Get all product requests for review.

**Headers:** `Authorization: Bearer <seller-token>` (or cookie)

### POST `/approve` (Seller Only)
Approve product request.

**Headers:** `Authorization: Bearer <seller-token>` (or cookie)

**Request Body:**
```json
{
  "requestId": "string (required)",
  "sellerNotes": "string (optional)"
}
```

### POST `/reject` (Seller Only)
Reject product request.

**Headers:** `Authorization: Bearer <seller-token>` (or cookie)

**Request Body:**
```json
{
  "requestId": "string (required)",
  "rejectionReason": "string (required)",
  "sellerNotes": "string (optional)"
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API endpoints may be rate limited to prevent abuse. Current limits:
- General endpoints: 100 requests per minute
- Authentication endpoints: 20 requests per minute
- File upload endpoints: 10 requests per minute

## File Upload Limits

- Maximum file size: 10MB per file
- Supported formats: JPEG, PNG, WebP
- Maximum files per request: 5 files
- Images are automatically optimized via Cloudinary
