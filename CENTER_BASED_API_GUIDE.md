# 🎯 Center-Based API - Complete Implementation Guide

## 📅 Implementation Date
**Created:** April 18, 2026

---

## 🚀 Features Overview

### 1. 🔐 Authentication & Access Control
- **Public Endpoints**: No authentication required (Students can view)
- **Protected Endpoints**: JWT token-based authentication
- **Role-Based Access**: Super Admin, Center Admin, Employee

### 2. 🏢 Center Data Management
- Create Center Data with thumbnail upload (linked to existing Center by ID)
- Get All Centers (public listing)
- Get Complete Center Data (returns center + centerData + gallery + success stories + faculty)
- Update Center details
- Delete Center (cascade delete - removes all related data)

### 3. 🖼️ Gallery Management
- Upload up to 6 images per center
- Delete individual gallery images
- Auto-replace old images when updating

### 4. 🏆 Success Stories Management
- Create success stories (student name, rank, photo)
- Update success stories
- Delete success stories

### 5. 👨‍🏫 Faculty Management
- Create faculty profiles (name, title, description, photo)
- Update faculty details
- Delete faculty members

---

## 📁 Architecture Design

### Model Structure

```
Center (Existing - Unchanged)
├── name (unique identifier)
└── centerAdmin

CenterData (NEW - Linked to Center by ID)
├── center (ObjectId → Center)
├── title
├── phone
├── email
├── thumbnail {url, public_id}
└── isActive

Gallery (NEW - Linked to Center by ID)
├── center (ObjectId → Center)
└── images[] [{url, public_id}] (max 6)

SuccessStory (NEW - Linked to Center by ID)
├── center (ObjectId → Center)
├── thumbnail {url, public_id}
├── name
└── rank

Faculty (NEW - Linked to Center by ID)
├── center (ObjectId → Center)
├── image {url, public_id}
├── name
├── title
└── description
```

---

## 📂 Files Created & Modified

### New Files Created (6)

#### 1. `models/CenterData.js`
```javascript
const mongoose = require('mongoose');

const centerDataSchema = new mongoose.Schema({
  center: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Center',
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  thumbnail: {
    url: String,
    public_id: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

centerDataSchema.index({ center: 1 });
centerDataSchema.index({ isActive: 1 });

module.exports = mongoose.model('CenterData', centerDataSchema);
```

#### 2. `models/Gallery.js`
```javascript
const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  center: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Center',
    required: true
  },
  images: [{
    url: String,
    public_id: String
  }]
}, { timestamps: true });

gallerySchema.path('images').validate(function(images) {
  return images.length <= 6;
}, 'Gallery cannot have more than 6 images');

gallerySchema.index({ center: 1 });

module.exports = mongoose.model('Gallery', gallerySchema);
```

#### 3. `models/SuccessStory.js`
```javascript
const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({
  center: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Center',
    required: true
  },
  thumbnail: {
    url: String,
    public_id: String
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  rank: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

successStorySchema.index({ center: 1 });

module.exports = mongoose.model('SuccessStory', successStorySchema);
```

#### 4. `models/Faculty.js`
```javascript
const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  center: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Center',
    required: true
  },
  image: {
    url: String,
    public_id: String
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

facultySchema.index({ center: 1 });

module.exports = mongoose.model('Faculty', facultySchema);
```

#### 5. `controllers/centerDataController.js` (695 lines)
Complete CRUD operations for all modules with:
- Cloudinary image upload/delete
- Cascade delete functionality
- Complete center data aggregation
- Role-based access validation

#### 6. `routes/centerDataRoutes.js` (146 lines)
Route definitions with:
- Public routes (no auth)
- Protected routes (auth required)
- Role-based middleware
- File upload middleware
- Validation middleware

---

### Modified Files (3)

#### 1. `middleware/validation.js`
Added validation schemas:
- `createCenter` - centerId, title, phone, email
- `updateCenter` - title, phone, email (optional)
- `createSuccessStory` - name, rank
- `updateSuccessStory` - name, rank (optional)
- `createFaculty` - name, title, description
- `updateFaculty` - name, title, description (optional)

#### 2. `app.js`
- Added route import: `const centerDataRoutes = require('./routes/centerDataRoutes');`
- Registered routes: `app.use('/api/centers', centerDataRoutes);`

#### 3. **Center Model (Unchanged)**
Existing Center model remains unchanged. Only uses Center ID reference.

---

## 🔌 Complete API Endpoints

### Base URL
```
http://localhost:5000/api/centers
```

### Public Endpoints (No Auth Required - Students Can View)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/centers` | Get all centers (list view with thumbnail, title, phone, email) |
| GET | `/api/centers/:id` | **Get complete center data** (center + centerData + gallery + success stories + faculty) |

### Protected Endpoints (Auth Required)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/centers` | Super Admin | Create center data (requires centerId) |
| PUT | `/api/centers/:id` | Super Admin | Update center data |
| DELETE | `/api/centers/:id` | Super Admin | Delete center data (cascade delete) |
| POST | `/api/centers/:id/gallery` | Super Admin, Center Admin | Update gallery (max 6 images) |
| DELETE | `/api/centers/:id/gallery/:imageId` | Super Admin, Center Admin | Delete gallery image |
| POST | `/api/centers/:id/success-stories` | Super Admin, Center Admin, Employee | Create success story |
| PUT | `/api/centers/:id/success-stories/:storyId` | Super Admin, Center Admin, Employee | Update success story |
| DELETE | `/api/centers/:id/success-stories/:storyId` | Super Admin, Center Admin, Employee | Delete success story |
| POST | `/api/centers/:id/faculty` | Super Admin, Center Admin, Employee | Create faculty |
| PUT | `/api/centers/:id/faculty/:facultyId` | Super Admin, Center Admin, Employee | Update faculty |
| DELETE | `/api/centers/:id/faculty/:facultyId` | Super Admin, Center Admin, Employee | Delete faculty |

---

## 🧪 Complete API Testing Guide

### Step 1: Start the Server

```bash
cd "c:\Users\thont\OneDrive\Desktop\Deekshith\New folder"
npm start
```

**Expected Output:**
```
Server running on port 5000
MongoDB Connected Successfully
```

---

### Step 2: Get Existing Center ID

Before creating center data, you need an existing Center ID.

**Get All Centers:**
```http
GET http://localhost:5000/api/centers
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "67890abcdef1234567890",
      "name": "delhi-center",
      "centerAdmin": "user123...",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    },
    {
      "_id": "67890abcdef1234567891",
      "name": "hyderabad-center",
      "centerAdmin": "user456...",
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

**Action:** Copy the `_id` value (e.g., `67890abcdef1234567890`) and save it as `centerId`.

---

### Step 3: Login to Get Token (Super Admin)

**Request:**
```http
POST http://localhost:5000/api/auth/login-super-admin
Content-Type: application/json

{
  "email": "admin@sriram.com",
  "password": "admin123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "67890...",
    "name": "Super Admin",
    "email": "admin@sriram.com",
    "role": "super_admin"
  }
}
```

**Action:** Copy the `token` value and add it to Postman:
- In Postman, go to **Authorization** tab
- Select **Bearer Token** type
- Paste the token value

---

### Step 4: Create Center Data

**Request:**
```http
POST http://localhost:5000/api/centers
Authorization: Bearer <your_token>
Content-Type: multipart/form-data
```

**Form Data:**
```
Key: centerId     Type: Text    Value: 67890abcdef1234567890
Key: title        Type: Text    Value: Sriram IAS Delhi Center
Key: phone        Type: Text    Value: 9876543210
Key: email        Type: Text    Value: delhi@sriram.com
Key: thumbnail    Type: File    Value: [Select image file]
```

**Postman Setup:**
1. Go to **Body** tab
2. Select **form-data**
3. Add fields as shown above
4. For `thumbnail`, hover over the key and select **File** from dropdown

**Expected Response:**
```json
{
  "success": true,
  "message": "Center data created successfully",
  "data": {
    "_id": "centerdata123...",
    "center": "67890abcdef1234567890",
    "title": "Sriram IAS Delhi Center",
    "phone": "9876543210",
    "email": "delhi@sriram.com",
    "thumbnail": {
      "url": "https://res.cloudinary.com/dqtasamcu/image/upload/v1234567890/centers/thumbnails/xyz.jpg",
      "public_id": "centers/thumbnails/xyz123"
    },
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**✅ Validation Rules:**
- `centerId`: Must be valid MongoDB ObjectId
- `title`: 2-100 characters (required)
- `phone`: Valid Indian mobile number (10 digits, starts with 6-9)
- `email`: Valid email format
- `thumbnail`: Image file (required)

---

### Step 5: Get All Centers (Public)

**Request:**
```http
GET http://localhost:5000/api/centers
```
*(No authentication required)*

**Expected Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "centerdata123...",
      "center": {
        "_id": "67890abcdef1234567890",
        "name": "delhi-center"
      },
      "title": "Sriram IAS Delhi Center",
      "phone": "9876543210",
      "email": "delhi@sriram.com",
      "thumbnail": {
        "url": "https://res.cloudinary.com/.../centers/thumbnails/xyz.jpg",
        "public_id": "centers/thumbnails/xyz123"
      },
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Step 6: Get Complete Center Data (Public - Main Endpoint)

**Request:**
```http
GET http://localhost:5000/api/centers/{{centerId}}
```
*(No authentication required - This is the main endpoint for frontend)*

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "center": {
      "_id": "67890abcdef1234567890",
      "name": "delhi-center",
      "centerAdmin": "user123...",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    },
    "centerData": {
      "_id": "centerdata123...",
      "center": "67890abcdef1234567890",
      "title": "Sriram IAS Delhi Center",
      "phone": "9876543210",
      "email": "delhi@sriram.com",
      "thumbnail": {
        "url": "https://res.cloudinary.com/.../centers/thumbnails/xyz.jpg",
        "public_id": "centers/thumbnails/xyz123"
      },
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "gallery": {
      "_id": "gallery123...",
      "center": "67890abcdef1234567890",
      "images": [
        {
          "url": "https://res.cloudinary.com/.../centers/gallery/img1.jpg",
          "public_id": "centers/gallery/img1"
        }
      ]
    },
    "successStories": [],
    "faculty": []
  }
}
```

**💡 This endpoint returns everything in one request!**

---

### Step 7: Update Gallery (Add Images)

**Request:**
```http
POST http://localhost:5000/api/centers/{{centerId}}/gallery
Authorization: Bearer <your_token>
Content-Type: multipart/form-data
```

**Form Data:**
```
Key: images    Type: File    Value: [Select image 1]
Key: images    Type: File    Value: [Select image 2]
Key: images    Type: File    Value: [Select image 3]
```
*(You can add up to 6 images)*

**Postman Setup:**
1. Go to **Body** tab
2. Select **form-data**
3. Add multiple rows with the same key "images"
4. Set each as **File** type

**Expected Response:**
```json
{
  "success": true,
  "message": "Gallery updated successfully",
  "data": {
    "_id": "gallery123...",
    "center": "67890abcdef1234567890",
    "images": [
      {
        "url": "https://res.cloudinary.com/.../centers/gallery/img1.jpg",
        "public_id": "centers/gallery/img1"
      },
      {
        "url": "https://res.cloudinary.com/.../centers/gallery/img2.jpg",
        "public_id": "centers/gallery/img2"
      },
      {
        "url": "https://res.cloudinary.com/.../centers/gallery/img3.jpg",
        "public_id": "centers/gallery/img3"
      }
    ],
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**⚠️ Important:**
- Maximum 6 images allowed
- Uploading new images **replaces all existing images**

---

### Step 8: Delete Gallery Image

**Request:**
```http
DELETE http://localhost:5000/api/centers/{{centerId}}/gallery/{{imageId}}
Authorization: Bearer <your_token>
```

**Note:** `imageId` can be either:
- The `public_id` of the image (e.g., `centers/gallery/img1`)
- The MongoDB `_id` of the image subdocument

**Expected Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully",
  "data": {
    "_id": "gallery123...",
    "center": "67890abcdef1234567890",
    "images": [
      {
        "url": "https://res.cloudinary.com/.../centers/gallery/img2.jpg",
        "public_id": "centers/gallery/img2"
      },
      {
        "url": "https://res.cloudinary.com/.../centers/gallery/img3.jpg",
        "public_id": "centers/gallery/img3"
      }
    ]
  }
}
```

---

### Step 9: Create Success Story

**Request:**
```http
POST http://localhost:5000/api/centers/{{centerId}}/success-stories
Authorization: Bearer <your_token>
Content-Type: multipart/form-data
```

**Form Data:**
```
Key: name         Type: Text    Value: Rahul Sharma
Key: rank         Type: Text    Value: AIR 1
Key: thumbnail    Type: File    Value: [Select student photo]
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Success story created successfully",
  "data": {
    "_id": "story123...",
    "center": "67890abcdef1234567890",
    "name": "Rahul Sharma",
    "rank": "AIR 1",
    "thumbnail": {
      "url": "https://res.cloudinary.com/.../centers/success-stories/student1.jpg",
      "public_id": "centers/success-stories/student1"
    },
    "createdAt": "2024-01-15T11:30:00.000Z",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  }
}
```

**Action:** Copy the `_id` and save it as `storyId` for update/delete operations.

---

### Step 10: Update Success Story

**Request:**
```http
PUT http://localhost:5000/api/centers/{{centerId}}/success-stories/{{storyId}}
Authorization: Bearer <your_token>
Content-Type: multipart/form-data
```

**Form Data (Optional fields):**
```
Key: name         Type: Text    Value: Rahul Sharma (Updated)
Key: rank         Type: Text    Value: AIR 1 - 2024 Batch
Key: thumbnail    Type: File    Value: [Select new photo - optional]
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Success story updated successfully",
  "data": {
    "_id": "story123...",
    "center": "67890abcdef1234567890",
    "name": "Rahul Sharma (Updated)",
    "rank": "AIR 1 - 2024 Batch",
    "thumbnail": {
      "url": "https://res.cloudinary.com/.../centers/success-stories/student1_updated.jpg",
      "public_id": "centers/success-stories/student1_updated"
    },
    "createdAt": "2024-01-15T11:30:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

---

### Step 11: Delete Success Story

**Request:**
```http
DELETE http://localhost:5000/api/centers/{{centerId}}/success-stories/{{storyId}}
Authorization: Bearer <your_token>
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Success story deleted successfully"
}
```

---

### Step 12: Create Faculty Member

**Request:**
```http
POST http://localhost:5000/api/centers/{{centerId}}/faculty
Authorization: Bearer <your_token>
Content-Type: multipart/form-data
```

**Form Data:**
```
Key: name         Type: Text    Value: Dr. Kumar
Key: title        Type: Text    Value: History Expert
Key: description  Type: Text    Value: 15 years of teaching experience in Indian History. Specialized in UPSC preparation.
Key: image        Type: File    Value: [Select faculty photo]
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Faculty member created successfully",
  "data": {
    "_id": "faculty123...",
    "center": "67890abcdef1234567890",
    "name": "Dr. Kumar",
    "title": "History Expert",
    "description": "15 years of teaching experience in Indian History. Specialized in UPSC preparation.",
    "image": {
      "url": "https://res.cloudinary.com/.../centers/faculty/faculty1.jpg",
      "public_id": "centers/faculty/faculty1"
    },
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

**Action:** Copy the `_id` and save it as `facultyId` for update/delete operations.

---

### Step 13: Update Faculty

**Request:**
```http
PUT http://localhost:5000/api/centers/{{centerId}}/faculty/{{facultyId}}
Authorization: Bearer <your_token>
Content-Type: multipart/form-data
```

**Form Data (Optional fields):**
```
Key: name         Type: Text    Value: Dr. Kumar (Updated)
Key: title        Type: Text    Value: Senior History Expert
Key: description  Type: Text    Value: 20 years of teaching experience...
Key: image        Type: File    Value: [Select new photo - optional]
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Faculty member updated successfully",
  "data": {
    "_id": "faculty123...",
    "center": "67890abcdef1234567890",
    "name": "Dr. Kumar (Updated)",
    "title": "Senior History Expert",
    "description": "20 years of teaching experience...",
    "image": {
      "url": "https://res.cloudinary.com/.../centers/faculty/faculty1_updated.jpg",
      "public_id": "centers/faculty/faculty1_updated"
    },
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:30:00.000Z"
  }
}
```

---

### Step 14: Delete Faculty

**Request:**
```http
DELETE http://localhost:5000/api/centers/{{centerId}}/faculty/{{facultyId}}
Authorization: Bearer <your_token>
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Faculty member deleted successfully"
}
```

---

### Step 15: Update Center Data

**Request:**
```http
PUT http://localhost:5000/api/centers/{{centerId}}
Authorization: Bearer <your_token>
Content-Type: multipart/form-data
```

**Form Data (Optional fields):**
```
Key: title        Type: Text    Value: Sriram IAS Delhi - Main Center
Key: phone        Type: Text    Value: 9876543211
Key: email        Type: Text    Value: delhi.main@sriram.com
Key: thumbnail    Type: File    Value: [Select new image - optional]
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Center data updated successfully",
  "data": {
    "_id": "centerdata123...",
    "center": "67890abcdef1234567890",
    "title": "Sriram IAS Delhi - Main Center",
    "phone": "9876543211",
    "email": "delhi.main@sriram.com",
    "thumbnail": {
      "url": "https://res.cloudinary.com/.../centers/thumbnails/xyz_updated.jpg",
      "public_id": "centers/thumbnails/xyz_updated"
    },
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T13:00:00.000Z"
  }
}
```

---

### Step 16: Delete Center (Cascade Delete)

**Request:**
```http
DELETE http://localhost:5000/api/centers/{{centerId}}
Authorization: Bearer <your_token>
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Center and all related data deleted successfully"
}
```

**⚠️ Cascade Delete Removes:**
- ✅ Center thumbnail from Cloudinary
- ✅ All gallery images from Cloudinary
- ✅ Gallery document
- ✅ All success stories (and their thumbnails)
- ✅ All faculty members (and their images)
- ✅ CenterData document

**This is a permanent deletion!**

---

## ⚠️ Validation Rules

### Center Data
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `centerId` | String | ✅ Yes | Valid MongoDB ObjectId |
| `title` | String | ✅ Yes | 2-100 characters |
| `phone` | String | ✅ Yes | Indian mobile (10 digits, starts with 6-9) |
| `email` | String | ✅ Yes | Valid email format |
| `thumbnail` | File | ✅ Yes | Image file |

### Gallery
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `images` | File[] | ✅ Yes | Max 6 files |

### Success Story
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | String | ✅ Yes | 2-100 characters |
| `rank` | String | ✅ Yes | 1-50 characters |
| `thumbnail` | File | ✅ Yes | Image file |

### Faculty
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | String | ✅ Yes | 2-100 characters |
| `title` | String | ✅ Yes | 2-100 characters |
| `description` | String | ✅ Yes | 10-2000 characters |
| `image` | File | ✅ Yes | Image file |

---

## 🔐 Role-Based Access Control

| Role | Center Data | Gallery | Success Stories | Faculty | View (Public) |
|------|-------------|---------|-----------------|---------|---------------|
| **Super Admin** | ✅ Full CRUD | ✅ Full CRUD | ✅ Full CRUD | ✅ Full CRUD | ✅ Yes |
| **Center Admin** | ❌ Read Only | ✅ Full CRUD | ✅ Full CRUD | ✅ Full CRUD | ✅ Yes |
| **Employee** | ❌ Read Only | ❌ No Access | ✅ Full CRUD | ✅ Full CRUD | ✅ Yes |
| **Student/No Token** | ❌ No Access | ❌ No Access | ❌ No Access | ❌ No Access | ✅ Yes |

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

### Common Error Codes
- **400**: Bad Request (validation failed, missing fields)
- **401**: Unauthorized (missing or invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (center/item doesn't exist)
- **500**: Internal Server Error

---

## 🎯 Frontend Integration Example

### When User Clicks on "Delhi Center"

```javascript
// Frontend code example
async function loadCenterData(centerId) {
  try {
    const response = await fetch(`http://localhost:5000/api/centers/${centerId}`);
    const result = await response.json();
    
    if (result.success) {
      const { center, centerData, gallery, successStories, faculty } = result.data;
      
      // Render center details
      renderCenterInfo(centerData);
      
      // Render gallery
      renderGallery(gallery.images);
      
      // Render success stories
      renderSuccessStories(successStories);
      
      // Render faculty
      renderFaculty(faculty);
    }
  } catch (error) {
    console.error('Error loading center data:', error);
  }
}
```

### Example: List All Centers on Homepage

```javascript
async function loadAllCenters() {
  try {
    const response = await fetch('http://localhost:5000/api/centers');
    const result = await response.json();
    
    if (result.success) {
      result.data.forEach(center => {
        // Display center card with thumbnail, title, phone, email
        renderCenterCard(center);
      });
    }
  } catch (error) {
    console.error('Error loading centers:', error);
  }
}
```

---

## 🚀 Key Features Summary

✅ **Separate Data Model** - CenterData model linked to Center by ID (Center model unchanged)  
✅ **Single Unified API** - All modules handled through one controller  
✅ **FormData Support** - All operations use multipart/form-data  
✅ **Center-Wise Data** - Everything organized by center ID  
✅ **Cloudinary Integration** - Automatic image upload/deletion  
✅ **Complete Data Endpoint** - GET /api/centers/:id returns everything  
✅ **Validation** - Required fields, max 6 images for gallery  
✅ **Role-Based Access** - Super Admin, Center Admin, Employee  
✅ **Cascade Delete** - Deleting center removes all related data  
✅ **Image Management** - Automatic cleanup from Cloudinary  
✅ **Public Endpoints** - Students can view without authentication  
✅ **Indexed Queries** - Optimized for performance  

---

## 📝 Testing Checklist

- [ ] Server is running on port 5000
- [ ] Existing Center ID obtained
- [ ] Login successful and token saved
- [ ] Center data created with thumbnail
- [ ] All centers list retrieved (public)
- [ ] Complete center data retrieved (public)
- [ ] Gallery updated with images (max 6)
- [ ] Gallery image deleted
- [ ] Success story created
- [ ] Success story updated
- [ ] Success story deleted
- [ ] Faculty member created
- [ ] Faculty member updated
- [ ] Faculty member deleted
- [ ] Center data updated
- [ ] Cascade delete verified (all related data removed)
- [ ] Cloudinary cleanup verified

---

## 🐛 Troubleshooting

### Error: "Center data already exists for this center or email"
**Solution:** A center can only have one CenterData entry. Delete existing data first or use UPDATE.

### Error: "Maximum 6 images allowed in gallery"
**Solution:** Gallery supports maximum 6 images. Delete some images before uploading more, or upload all new images (replaces all).

### Error: "Invalid Indian mobile number"
**Solution:** Phone must be 10 digits and start with 6-9 (e.g., 9876543210).

### Error: "Center not found"
**Solution:** Ensure the centerId exists in the Center collection before creating CenterData.

### Error: "Token is required"
**Solution:** Add Authorization header: `Bearer <your_token>` for protected endpoints.

---

## 📚 Postman Collection

### Import Instructions:
1. Open Postman
2. Click **Import** (top left)
3. Select **File** tab
4. Create a new collection named "Center-Based API"
5. Add all 16 endpoints from this guide

### Environment Variables:
Set these in Postman:
- `baseUrl`: `http://localhost:5000`
- `token`: Your JWT token
- `centerId`: Your Center MongoDB ID
- `storyId`: Success story ID (after creation)
- `facultyId`: Faculty ID (after creation)
- `imageId`: Gallery image public_id or _id

---

## 🎉 Implementation Complete!

All features have been successfully implemented and are ready for testing and production use.

**Files Created:** 6  
**Files Modified:** 3  
**Total Lines of Code:** ~950 lines  
**API Endpoints:** 13  
**Models:** 4 (CenterData, Gallery, SuccessStory, Faculty)  

### Quick Reference:
- **Public APIs** (No Auth): `GET /api/centers`, `GET /api/centers/:id`
- **Super Admin Only**: Create/Update/Delete center data
- **Center Admin**: Gallery, Success Stories, Faculty
- **Employee**: Success Stories, Faculty
- **Students**: View only (public endpoints)

**Happy Testing! 🚀**
