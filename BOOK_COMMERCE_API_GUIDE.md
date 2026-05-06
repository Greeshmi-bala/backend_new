# Book Commerce Module - API Testing Guide

## 📊 API Overview

| Part | Feature | Endpoints | Description |
|------|---------|-----------|-------------|
| **Part 1** | 📚 Books | 6 APIs | CRUD operations for books |
| **Part 2** | 🎥 Videos | 10 APIs | Independent Overview & Topper video management |
| **Part 3** | 🎫 Coupons | 5 APIs | Coupon creation and validation |
| **Part 4** | 💳 Payment | 2 APIs | Razorpay integration |
| **Part 5** | 📦 Orders | 5 APIs | Order management |

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

# 📚 PART 1: BOOK APIs

## 1. Create Book

**Endpoint:** `POST /api/books`

**Access:** Private (Super Admin & Admin only)

**Content-Type:** `multipart/form-data`

**Form Data Fields:**
- `title` (text, required): Book title (max 200 characters)
- `authorNames` (JSON array, required): Array of author names
- `subjects` (JSON array, required): Array of subjects
- `summary` (text, required): Book summary (max 2000 characters)
- `fullPrice` (number, required): Original price
- `discountPercent` (number, optional): Discount percentage (0-100, default: 0)
- `discountedPrice` (auto-calculated): **NOT REQUIRED** - Backend calculates automatically
- `isBestSeller` (boolean, optional): Mark as best seller (true/false)
- `image` (file, required): Book cover image (JPEG, PNG, WebP - max 5MB)

**📝 Note:** Overview and Topper videos are completely independent and managed via separate APIs (see Part 2). They are NOT linked to any specific book.

**💡 Auto-Calculation:**
```javascript
discountedPrice = fullPrice - (fullPrice × discountPercent / 100)

Example:
fullPrice: 1000
discountPercent: 20
discountedPrice: 800 (automatically calculated)
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "book_id_here",
    "title": "Complete Guide to UPSC",
    "authorNames": ["John Doe", "Jane Smith"],
    "subjects": ["Polity", "History", "Geography"],
    "summary": "Comprehensive guide for UPSC preparation",
    "image": {
      "url": "https://res.cloudinary.com/.../book-cover.jpg",
      "publicId": "books/covers/xyz123"
    },
    "fullPrice": 999,
    "discountPercent": 20,
    "discountedPrice": 799,
    "isBestSeller": true,
    "isActive": true,
    "createdAt": "2026-04-18T10:30:00.000Z",
    "updatedAt": "2026-04-18T10:30:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/books \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Complete Guide to UPSC" \
  -F 'authorNames=["John Doe", "Jane Smith"]' \
  -F 'subjects=["Polity", "History"]' \
  -F "summary=Comprehensive guide for UPSC preparation" \
  -F "fullPrice=999" \
  -F "discountPercent=20" \
  -F "isBestSeller=true" \
  -F "image=@/path/to/book-cover.jpg"
```

---

## 2. Get All Books

**Endpoint:** `GET /api/books`

**Access:** Public

**Query Parameters:**
- `isBestSeller` (boolean, optional): Filter best sellers only
- `subject` (string, optional): Filter by subject
- `limit` (number, optional): Items per page
- `page` (number, optional): Page number

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "book_id_here",
      "title": "Complete Guide to UPSC",
      "authorNames": ["John Doe"],
      "subjects": ["Polity", "History"],
      "summary": "Comprehensive guide",
      "image": { "url": "...", "publicId": "..." },
      "fullPrice": 999,
      "discountPercent": 20,
      "discountedPrice": 799,
      "isBestSeller": true,
      "isActive": true
    }
  ]
}
```

**cURL Example:**
```bash
# Get all books
curl http://localhost:5000/api/books

# Get best sellers only
curl "http://localhost:5000/api/books?isBestSeller=true"

# Get books by subject
curl "http://localhost:5000/api/books?subject=Polity"

# With pagination
curl "http://localhost:5000/api/books?limit=5&page=1"
```

---

## 3. Get Single Book

**Endpoint:** `GET /api/books/:id`

**Access:** Public

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "book_id_here",
    "title": "Complete Guide to UPSC",
    "authorNames": ["John Doe", "Jane Smith"],
    "subjects": ["Polity", "History", "Geography"],
    "summary": "Comprehensive guide for UPSC preparation",
    "image": { "url": "...", "publicId": "..." },
    "fullPrice": 999,
    "discountPercent": 20,
    "discountedPrice": 799,
    "isBestSeller": true,
    "isActive": true
  }
}
```

**cURL Example:**
```bash
curl http://localhost:5000/api/books/book_id_here
```

---

## 4. Get Sample Books (Latest 10 for Carousel)

**Endpoint:** `GET /api/books/sample`

**Access:** Public

**Success Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "book_id",
      "title": "Complete Guide to UPSC",
      "image": { "url": "...", "publicId": "..." },
      "discountedPrice": 799,
      "fullPrice": 999,
      "discountPercent": 20,
      "subjects": ["Polity", "History"]
    }
  ]
}
```

**cURL Example:**
```bash
curl http://localhost:5000/api/books/sample
```

---

## 5. Update Book

**Endpoint:** `PUT /api/books/:id`

**Access:** Private (Super Admin & Admin only)

**Content-Type:** `multipart/form-data`

**Form Data Fields (all optional):**
- Same as Create Book (only send fields you want to update)

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/books/book_id_here \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Updated Book Title" \
  -F "discountedPrice=699"
```

---

## 6. Delete Book

**Endpoint:** `DELETE /api/books/:id`

**Access:** Private (Super Admin & Admin only)

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/books/book_id_here \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

# 🎥 PART 2: INDEPENDENT VIDEO APIs (Overview & Topper)

**⚠️ IMPORTANT:** These video APIs are completely independent and NOT linked to any book. They are separate content sections on your page.

---

## OVERVIEW VIDEOS

### 1. Get All Overview Videos

**Endpoint:** `GET /api/overviews`

**Access:** Public

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "overview_id",
      "title": "UPSC Preparation Guide",
      "videoUrl": "https://res.cloudinary.com/.../video.mp4",
      "videoPublicId": "books/overviews/xyz123",
      "isActive": true,
      "createdAt": "2026-04-18T10:30:00.000Z",
      "updatedAt": "2026-04-18T10:30:00.000Z"
    }
  ]
}
```

**cURL Example:**
```bash
curl http://localhost:5000/api/overviews
```

---

### 2. Get Single Overview Video

**Endpoint:** `GET /api/overviews/:id`

**Access:** Public

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "overview_id",
    "title": "UPSC Preparation Guide",
    "videoUrl": "https://res.cloudinary.com/.../video.mp4",
    "videoPublicId": "books/overviews/xyz123",
    "isActive": true,
    "createdAt": "2026-04-18T10:30:00.000Z",
    "updatedAt": "2026-04-18T10:30:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl http://localhost:5000/api/overviews/overview_id_here
```

---

### 3. Create Overview Video

**Endpoint:** `POST /api/overviews`

**Access:** Private (Super Admin & Admin only)

**Content-Type:** `multipart/form-data`

**Form Data Fields:**
- `title` (text, required): Video title
- `video` (file, required): Video file (MP4 - max 10MB)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Overview video created successfully",
  "data": {
    "_id": "overview_id",
    "title": "UPSC Preparation Guide",
    "videoUrl": "https://res.cloudinary.com/.../video.mp4",
    "videoPublicId": "books/overviews/xyz123",
    "isActive": true
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/overviews \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=UPSC Preparation Guide" \
  -F "video=@/path/to/video.mp4"
```

---

### 4. Update Overview Video

**Endpoint:** `PUT /api/overviews/:id`

**Access:** Private (Super Admin & Admin only)

**Content-Type:** `multipart/form-data`

**Form Data Fields (all optional):**
- `title` (text, optional): Updated video title
- `video` (file, optional): New video file (replaces old one)

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/overviews/overview_id_here \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Updated Title" \
  -F "video=@/path/to/new-video.mp4"
```

---

### 5. Delete Overview Video

**Endpoint:** `DELETE /api/overviews/:id`

**Access:** Private (Super Admin & Admin only)

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/overviews/overview_id_here \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## TOPPER VIDEOS

### 6. Get All Topper Videos

**Endpoint:** `GET /api/toppers`

**Access:** Public

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "topper_id",
      "title": "Topper Success Story",
      "videoUrl": "https://res.cloudinary.com/.../topper-video.mp4",
      "videoPublicId": "books/toppers/abc456",
      "isActive": true,
      "createdAt": "2026-04-18T10:30:00.000Z",
      "updatedAt": "2026-04-18T10:30:00.000Z"
    }
  ]
}
```

**cURL Example:**
```bash
curl http://localhost:5000/api/toppers
```

---

### 7. Get Single Topper Video

**Endpoint:** `GET /api/toppers/:id`

**Access:** Public

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "topper_id",
    "title": "Topper Success Story",
    "videoUrl": "https://res.cloudinary.com/.../topper-video.mp4",
    "videoPublicId": "books/toppers/abc456",
    "isActive": true,
    "createdAt": "2026-04-18T10:30:00.000Z",
    "updatedAt": "2026-04-18T10:30:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl http://localhost:5000/api/toppers/topper_id_here
```

---

### 8. Create Topper Video

**Endpoint:** `POST /api/toppers`

**Access:** Private (Super Admin & Admin only)

**Content-Type:** `multipart/form-data`

**Form Data Fields:**
- `title` (text, required): Video title
- `video` (file, required): Video file (MP4 - max 10MB)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Topper video created successfully",
  "data": {
    "_id": "topper_id",
    "title": "Topper Success Story",
    "videoUrl": "https://res.cloudinary.com/.../topper-video.mp4",
    "videoPublicId": "books/toppers/abc456",
    "isActive": true
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/toppers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Topper Success Story" \
  -F "video=@/path/to/topper-video.mp4"
```

---

### 9. Update Topper Video

**Endpoint:** `PUT /api/toppers/:id`

**Access:** Private (Super Admin & Admin only)

**Content-Type:** `multipart/form-data`

**Form Data Fields (all optional):**
- `title` (text, optional): Updated video title
- `video` (file, optional): New video file (replaces old one)

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/toppers/topper_id_here \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Updated Title" \
  -F "video=@/path/to/new-video.mp4"
```

---

### 10. Delete Topper Video

**Endpoint:** `DELETE /api/toppers/:id`

**Access:** Private (Super Admin & Admin only)

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/toppers/topper_id_here \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

# 🎫 PART 3: COUPON APIs

## 1. Apply Coupon

**Endpoint:** `POST /api/coupons/apply`

**Access:** Private (All authenticated users)

**Request Body:**
```json
{
  "code": "BOOK10",
  "category": "BOOK",
  "amount": 799
}
```

**Fields:**
- `code` (string, required): Coupon code
- `category` (string, required): Category - "BOOK", "TEST_SERIES", "COURSE"
- `amount` (number, required): Total amount to apply coupon on

**Success Response (200):**
```json
{
  "success": true,
  "message": "Coupon applied successfully",
  "data": {
    "couponCode": "BOOK10",
    "originalPrice": 799,
    "discount": 80,
    "finalPrice": 719
  }
}
```

**Error Responses:**

**404 - Invalid coupon:**
```json
{
  "success": false,
  "message": "Invalid coupon code"
}
```

**400 - Wrong category:**
```json
{
  "success": false,
  "message": "This coupon is not applicable for TEST_SERIES. Applicable for: BOOK"
}
```

**400 - Expired coupon:**
```json
{
  "success": false,
  "message": "Coupon has expired"
}
```

**400 - Usage limit reached:**
```json
{
  "success": false,
  "message": "Coupon usage limit reached"
}
```

**400 - New user only:**
```json
{
  "success": false,
  "message": "This coupon is only for new users"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/coupons/apply \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "BOOK10",
    "category": "BOOK",
    "amount": 799
  }'
```

---

## 2. Create Coupon (Admin)

**Endpoint:** `POST /api/coupons`

**Access:** Private (Super Admin & Admin only)

**Request Body:**
```json
{
  "code": "BOOK10",
  "type": "PERCENT",
  "value": 10,
  "usageLimit": 100,
  "isNewUserOnly": false,
  "category": "BOOK",
  "expiryDate": "2026-12-31"
}
```

**Fields:**
- `code` (string, required): Coupon code (will be converted to uppercase)
- `type` (string, required): "PERCENT" or "FIXED"
- `value` (number, required): Discount value (percentage or fixed amount)
- `usageLimit` (number, optional): Total times coupon can be used
- `isNewUserOnly` (boolean, optional): Only for first-time buyers
- `category` (string, required): "BOOK", "TEST_SERIES", or "COURSE"
- `expiryDate` (date, required): Expiration date

**Success Response (201):**
```json
{
  "success": true,
  "message": "Coupon created successfully",
  "data": {
    "_id": "coupon_id",
    "code": "BOOK10",
    "type": "PERCENT",
    "value": 10,
    "usageLimit": 100,
    "usedCount": 0,
    "isNewUserOnly": false,
    "category": "BOOK",
    "expiryDate": "2026-12-31T00:00:00.000Z",
    "isActive": true
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/coupons \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "BOOK10",
    "type": "PERCENT",
    "value": 10,
    "usageLimit": 100,
    "isNewUserOnly": false,
    "expiryDate": "2026-12-31"
  }'
```

---

## 3. Get All Coupons (Admin)

**Endpoint:** `GET /api/coupons`

**Access:** Private (Super Admin & Admin only)

**cURL Example:**
```bash
curl http://localhost:5000/api/coupons \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 4. Update Coupon (Admin)

**Endpoint:** `PUT /api/coupons/:id`

**Access:** Private (Super Admin & Admin only)

**Request Body:** (only send fields to update)
```json
{
  "value": 15,
  "expiryDate": "2027-12-31"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/coupons/coupon_id \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": 15,
    "expiryDate": "2027-12-31"
  }'
```

---

## 5. Delete Coupon (Admin)

**Endpoint:** `DELETE /api/coupons/:id`

**Access:** Private (Super Admin & Admin only)

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/coupons/coupon_id \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

# 💳 PART 4: PAYMENT APIs

## 1. Create Razorpay Order

**Endpoint:** `POST /api/payment/create-order`

**Access:** Private (All authenticated users)

**🔒 SECURITY:** Backend calculates amount from books. Frontend CANNOT manipulate price.

**Request Body:**
```json
{
  "books": [
    {
      "bookId": "book_id_here",
      "quantity": 1
    }
  ],
  "couponCode": "BOOK10"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "orderId": "order_xxxxxxxx",
    "amount": 719,           // Amount in rupees (for display)
    "amountInPaise": 71900,  // Amount in paise (for Razorpay)
    "currency": "INR"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/payment/create-order \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "books": [{"bookId": "book_id", "quantity": 1}],
    "couponCode": "BOOK10"
  }'
```

---

## 2. Verify Payment & Create Order

**Endpoint:** `POST /api/payment/verify`

**Access:** Private (All authenticated users)

**⚠️ SECURITY NOTE:** Backend recalculates all prices from database. Frontend prices are NOT trusted.

**Request Body:**
```json
{
  "razorpay_order_id": "order_xxxxxxxx",
  "razorpay_payment_id": "pay_xxxxxxxx",
  "razorpay_signature": "signature_here",
  "books": [
    {
      "bookId": "book_id_here",
      "quantity": 1
    }
  ],
  "couponCode": "BOOK10",
  "address": {
    "fullName": "John Doe",
    "mobile": "9876543210",
    "addressLine": "123 Main Street, Apt 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "landmark": "Near City Mall"
  }
}
```

**Address Fields:**
- `fullName` (string, required): Recipient's full name
- `mobile` (string, required): 10-digit Indian mobile number (starts with 6-9)
- `addressLine` (string, required): Complete address
- `city` (string, required): City name
- `state` (string, required): State name
- `pincode` (string, required): 6-digit pincode
- `landmark` (string, optional): Nearby landmark

**Important Changes:**
- ❌ `totalPrice` - REMOVED (backend calculates)
- ❌ `discount` - REMOVED (backend calculates)
- ❌ `finalPrice` - REMOVED (backend calculates)
- ❌ `price` in books - REMOVED (backend gets from database)
- ✅ Backend fetches actual prices from Book collection
- ✅ Backend validates coupon and recalculates discount
- ✅ Backend prevents price tampering

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment verified and order created successfully",
  "data": {
    "_id": "order_id",
    "userId": "user_id",
    "books": [...],
    "totalPrice": 799,
    "discount": 80,
    "finalPrice": 719,
    "couponCode": "BOOK10",
    "paymentStatus": "SUCCESS",
    "orderStatus": "PLACED",
    "address": "123 Main St, City, State - 123456",
    "razorpayOrderId": "order_xxxxxxxx",
    "razorpayPaymentId": "pay_xxxxxxxx",
    "razorpaySignature": "signature_here"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/payment/verify \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_xxx",
    "razorpay_payment_id": "pay_xxx",
    "razorpay_signature": "signature",
    "books": [{"bookId": "book_id", "quantity": 1}],
    "couponCode": "BOOK10",
    "address": {
      "fullName": "John Doe",
      "mobile": "9876543210",
      "addressLine": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    }
  }'
```

---

# 📦 PART 5: ORDER APIs

## 1. Get My Orders (Purchase History)

**Endpoint:** `GET /api/orders/my-orders`

**Access:** Private (All authenticated users)

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "order_id",
      "userId": "user_id",
      "books": [
        {
          "bookId": {
            "_id": "book_id",
            "title": "Complete Guide to UPSC",
            "image": { "url": "..." },
            "discountedPrice": 799
          },
          "quantity": 1,
          "price": 719
        }
      ],
      "totalPrice": 799,
      "discount": 80,
      "finalPrice": 719,
      "couponCode": "BOOK10",
      "paymentStatus": "SUCCESS",
      "orderStatus": "PLACED",
      "address": "123 Main St",
      "createdAt": "2026-04-18T10:30:00.000Z"
    }
  ]
}
```

**cURL Example:**
```bash
curl http://localhost:5000/api/orders/my-orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 2. Get Single Order

**Endpoint:** `GET /api/orders/:id`

**Access:** Private (Order owner or Admin)

**cURL Example:**
```bash
curl http://localhost:5000/api/orders/order_id \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 3. Get All Orders (Admin)

**Endpoint:** `GET /api/orders`

**Access:** Private (Super Admin & Admin only)

**Query Parameters:**
- `status` (string, optional): Filter by order status (PLACED, SHIPPED, DELIVERED, CANCELLED)
- `limit` (number, optional): Items per page
- `page` (number, optional): Page number

**cURL Example:**
```bash
# Get all orders
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN"

# Filter by status
curl "http://localhost:5000/api/orders?status=PLACED" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 4. Update Order Status (Admin)

**Endpoint:** `PUT /api/orders/:id/status`

**Access:** Private (Super Admin & Admin only)

**Request Body:**
```json
{
  "orderStatus": "SHIPPED"
}
```

**Valid Statuses:** `PLACED`, `SHIPPED`, `DELIVERED`, `CANCELLED`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "_id": "order_id",
    "orderStatus": "SHIPPED",
    ...
  }
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/orders/order_id/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "orderStatus": "SHIPPED"
  }'
```

---

# 🔄 COMPLETE PURCHASE FLOW

## Step-by-Step Process:

1. **User views book details**
   ```
   GET /api/books/:id
   ```

2. **User views overview videos (independent section)**
   ```
   GET /api/overviews
   ```

3. **User views topper videos (independent section)**
   ```
   GET /api/toppers
   ```

4. **Apply coupon (optional)**
   ```
   POST /api/coupons/apply
   Body: { "code": "BOOK10", "category": "BOOK", "amount": 799 }
   Response: { "finalPrice": 719 }
   ```

5. **Create Razorpay order**
   ```
   POST /api/payment/create-order
   Body: { 
     "books": [{ "bookId": "book_id", "quantity": 1 }],
     "couponCode": "BOOK10" 
   }
   Response: { 
     "orderId": "order_xxx",
     "amount": 719,
     "amountInPaise": 71900  // Use this for Razorpay
   }
   
   Note: Backend calculates amount from database!
   ```

6. **Frontend opens Razorpay checkout**
   ```javascript
   const options = {
     key: "rzp_test_XXX",
     amount: response.amountInPaise, // Use backend value (in paise)
     currency: "INR",
     order_id: response.orderId,
     handler: function(response) {
       // Call verify API
     }
   };
   const rzp = new Razorpay(options);
   rzp.open();
   ```

7. **Verify payment & create order**
   ```
   POST /api/payment/verify
   Body: {
     "razorpay_order_id": "order_xxx",
     "razorpay_payment_id": "pay_xxx",
     "razorpay_signature": "signature",
     "books": [{ "bookId": "book_id", "quantity": 1 }],
     "couponCode": "BOOK10",
     "address": {
       "fullName": "John Doe",
       "mobile": "9876543210",
       "addressLine": "123 Main St",
       "city": "Mumbai",
       "state": "Maharashtra",
       "pincode": "400001"
     }
   }
   
   Note: Backend recalculates prices and validates everything!
   ```

8. **User views purchase history**
   ```
   GET /api/orders/my-orders
   ```

9. **Admin updates order status**
   ```
   PUT /api/orders/order_id/status
   Body: { "orderStatus": "SHIPPED" }
   ```

---

# 📝 TESTING CHECKLIST

## Book Testing
- [ ] Create book with all fields
- [ ] Create book without image (should fail)
- [ ] Get all books
- [ ] Get best sellers
- [ ] Get sample books (latest 10)
- [ ] Get single book
- [ ] Update book
- [ ] Delete book
- [ ] Filter by subject

## Video Testing (Independent)
- [ ] Create overview video with file upload
- [ ] Create overview video without file (should fail)
- [ ] Create overview video without title (should fail)
- [ ] Get all overview videos
- [ ] Get single overview video
- [ ] Update overview video
- [ ] Delete overview video
- [ ] Create topper video with file upload
- [ ] Create topper video with topperName and examRank
- [ ] Get all topper videos
- [ ] Get single topper video
- [ ] Update topper video
- [ ] Delete topper video

## Coupon Testing
- [ ] Create PERCENT coupon with BOOK category
- [ ] Create FIXED coupon with TEST_SERIES category
- [ ] Create coupon with COURSE category
- [ ] Apply valid coupon with correct category
- [ ] Apply coupon with wrong category (should fail)
- [ ] Apply expired coupon (should fail)
- [ ] Apply coupon with exceeded usage limit (should fail)
- [ ] Apply new-user-only coupon with existing user (should fail)
- [ ] Update coupon
- [ ] Delete coupon

## Payment Testing
- [ ] Create Razorpay order
- [ ] Verify payment with valid signature
- [ ] Verify payment with invalid signature (should fail)
- [ ] Create order with coupon
- [ ] Create order without coupon

## Order Testing
- [ ] View my orders
- [ ] View single order
- [ ] Admin view all orders
- [ ] Admin update order status
- [ ] Verify coupon usage count increased

---

# 🔧 ENVIRONMENT VARIABLES

Add these to your `.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
```

Get your Razorpay keys from: https://dashboard.razorpay.com/

---

# 🎯 IMPORTANT NOTES

1. **Image Upload**: Book images are uploaded to Cloudinary in `books/covers` folder
2. **Video Upload**: Overview and Topper videos are uploaded to Cloudinary in `books/overviews` and `books/toppers` folders respectively
3. **Video Format**: Only MP4 videos are accepted (max 10MB)
4. **Independent Videos**: Overview and Topper videos are NOT linked to any book - they are completely independent content sections
5. **💡 Auto-Calculated Pricing**: 
   - `discountedPrice` is automatically calculated from `fullPrice` and `discountPercent`
   - Formula: `discountedPrice = fullPrice - (fullPrice × discountPercent / 100)`
   - No need to manually provide `discountedPrice`
   - Rounded to nearest integer to avoid decimal issues
6. **🔒 SECURITY - Price Calculation**: 
   - Backend recalculates ALL prices from database
   - Frontend prices are NEVER trusted
   - Prevents price tampering attacks
7. **🔒 SECURITY - Duplicate Prevention**: Each Razorpay payment ID can only be used once
8. **Coupon Logic**: 
   - PERCENT: `discount = (price * value) / 100`
   - FIXED: `discount = value`
   - Final price is never negative (Math.max(0, price - discount))
9. **Payment Amount**: Always send amount in Rupees, backend converts to paise (×100)
10. **Signature Verification**: Critical for payment security - never skip this
11. **Coupon Auto-Uppercase**: All coupon codes are converted to uppercase
12. **Coupon Category**: Must be "BOOK", "TEST_SERIES", or "COURSE" - coupons are category-based, not item-based
13. **Category Validation**: Backend validates coupon.category matches request category
14. **Soft Delete**: Books are soft deleted (isActive = false) and cannot be purchased
15. **Order Statuses**: PLACED → SHIPPED → DELIVERED (or CANCELLED at any point)
16. **Subject Filtering**: Uses `$in` operator for proper array matching

---

# 🐛 COMMON ISSUES

### Issue: "Book image is required"
**Solution:** Ensure you're uploading an image using form-data, not JSON.

### Issue: "Video file is required"
**Solution:** Ensure you're uploading a video file using form-data with field name `video`.

### Issue: "Title is required"
**Solution:** Provide a `title` field in your form-data when creating overview/topper videos.

### Issue: "Invalid coupon code"
**Solution:** Check coupon exists, is active, and not expired.

### Issue: "This coupon is not applicable for..."
**Solution:** Ensure the `category` in your request matches the coupon's category (BOOK, TEST_SERIES, or COURSE).

### Issue: "Invalid payment signature"
**Solution:** Verify you're using the correct Razorpay secret key.

### Issue: "Coupon usage limit reached"
**Solution:** Create a new coupon or increase the usage limit.

### Issue: "This coupon is only for new users"
**Solution:** User must have 0 previous orders to use new-user-only coupons.

---

# 🏗️ ARCHITECTURE

## Clean Separation of Concerns

```javascript
// ✅ Book Model - Contains ONLY book data
{
  title, authorNames, subjects, summary,
  image, fullPrice, discountPercent, 
  discountedPrice, isBestSeller
}

// ✅ BookOverview Model - Independent video collection (NOT linked to books)
{
  title,
  videoUrl,
  videoPublicId
}

// ✅ BookTopper Model - Independent video collection (NOT linked to books)
{
  title,
  videoUrl,
  videoPublicId
}

// ✅ Coupon Model - Category-based (NOT item-based)
{
  code,
  type: "PERCENT" | "FIXED",
  value,
  usageLimit,
  usedCount,
  isNewUserOnly,
  category: "BOOK" | "TEST_SERIES" | "COURSE",
  expiryDate,
  isActive
}
```

## Benefits:

1. **Complete Independence**: Videos are NOT tied to any book - they're separate page sections
2. **Flexible Management**: Add/update videos without affecting book data
3. **Better Performance**: Book details load faster (no video data)
4. **Scalability**: Easy to add more independent video sections
5. **Simpler UI**: Direct mapping to independent page sections
6. **Category-Based Coupons**: Coupons work across all items in a category (BOOK, TEST_SERIES, COURSE)
7. **No Item Coupling**: Coupons are NOT tied to specific items - fully reusable

## API Structure:

```
GET /api/books                → All books
GET /api/books/:id            → Single book details
GET /api/overviews            → All overview videos (independent)
GET /api/overviews/:id        → Single overview video
GET /api/toppers              → All topper videos (independent)
GET /api/toppers/:id          → Single topper video
GET /api/books/sample         → Latest 10 books for carousel
```
