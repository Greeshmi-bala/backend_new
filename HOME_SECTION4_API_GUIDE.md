# Home Page Section 4 - Learning Programs API

## Overview
Separate CRUD API for managing home page Section 4 (Learning Programs) with individual card management and multiple image uploads per card.

---

## Base URL
```
http://localhost:5000/api
```

---

## Table of Contents
1. [Get All Section 4 Cards](#1-get-all-section-4-cards)
2. [Create Section 4 Card](#2-create-section-4-card)
3. [Update Section 4 Card](#3-update-section-4-card)
4. [Delete Section 4 Card](#4-delete-section-4-card)
5. [Homepage Integration](#homepage-integration)
6. [Complete Code](#complete-code)

---

## 1. Get All Section 4 Cards

**Endpoint:** `GET /section4`

**Access:** Public

**Description:** Returns all active section 4 cards sorted by order.

### Response

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "69ec...",
      "title": "Daily Quizzes",
      "description": "Participate in daily quizzes and test your knowledge",
      "images": [
        "https://res.cloudinary.com/.../quiz1.jpg",
        "https://res.cloudinary.com/.../quiz2.jpg"
      ],
      "order": 1,
      "isActive": true,
      "createdAt": "2026-04-25T10:00:00.000Z",
      "updatedAt": "2026-04-25T10:00:00.000Z"
    },
    {
      "_id": "69ec...",
      "title": "Daily Current Affairs",
      "description": "Stay updated with daily current affairs",
      "images": [
        "https://res.cloudinary.com/.../ca1.jpg"
      ],
      "order": 2,
      "isActive": true,
      "createdAt": "2026-04-25T11:00:00.000Z",
      "updatedAt": "2026-04-25T11:00:00.000Z"
    },
    {
      "_id": "69ec...",
      "title": "Daily Mains Answer Writing",
      "description": "Practice mains answer writing daily",
      "images": [
        "https://res.cloudinary.com/.../mains1.jpg",
        "https://res.cloudinary.com/.../mains2.jpg",
        "https://res.cloudinary.com/.../mains3.jpg"
      ],
      "order": 3,
      "isActive": true,
      "createdAt": "2026-04-25T12:00:00.000Z",
      "updatedAt": "2026-04-25T12:00:00.000Z"
    }
  ]
}
```

### Testing

```bash
curl -X GET http://localhost:5000/api/section4
```

**Postman:**
- Method: GET
- URL: `http://localhost:5000/api/section4`

---

## 2. Create Section 4 Card

**Endpoint:** `POST /section4`

**Access:** Private (Super Admin only)

**Authentication Required:** Yes

**Content-Type:** `multipart/form-data`

### Request Body (FormData)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | Text | Yes | Card title (e.g., "Daily Quizzes") |
| `description` | Text | Yes | Card description |
| `images` | File | No | Multiple images (JPG, PNG) |
| `order` | Number | No | Display order (default: 0) |

### Testing with Postman

1. **Method:** POST
2. **URL:** `http://localhost:5000/api/section4`
3. **Headers:**
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```
4. **Body:** Select `form-data`

| Key | Value | Type |
|-----|-------|------|
| `title` | Daily Quizzes | Text |
| `description` | Participate in daily quizzes and test your knowledge | Text |
| `images` | [Select File] | File |
| `images` | [Select File] | File |
| `images` | [Select File] | File |
| `order` | 1 | Text |

### Response

```json
{
  "success": true,
  "message": "Section 4 card created successfully",
  "data": {
    "_id": "69ec...",
    "title": "Daily Quizzes",
    "description": "Participate in daily quizzes and test your knowledge",
    "images": [
      "https://res.cloudinary.com/.../quiz1.jpg",
      "https://res.cloudinary.com/.../quiz2.jpg",
      "https://res.cloudinary.com/.../quiz3.jpg"
    ],
    "order": 1,
    "isActive": true,
    "createdAt": "2026-04-25T10:00:00.000Z",
    "updatedAt": "2026-04-25T10:00:00.000Z"
  }
}
```

### Testing with cURL

```bash
curl -X POST http://localhost:5000/api/section4 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Daily Quizzes" \
  -F "description=Participate in daily quizzes" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "order=1"
```

---

## 3. Update Section 4 Card

**Endpoint:** `PUT /section4/:id`

**Access:** Private (Super Admin only)

**Authentication Required:** Yes

**Content-Type:** `multipart/form-data`

### Request Body (FormData)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | Text | No | New title |
| `description` | Text | No | New description |
| `images` | File | No | New images (replaces old images) |
| `order` | Number | No | New order |

### Testing with Postman

1. **Method:** PUT
2. **URL:** `http://localhost:5000/api/section4/69ec...`
3. **Headers:**
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```
4. **Body:** Select `form-data`

**Example 1: Update only title and description**

| Key | Value | Type |
|-----|-------|------|
| `title` | Daily Quiz (Updated) | Text |
| `description` | Updated description | Text |

**Example 2: Update with new images**

| Key | Value | Type |
|-----|-------|------|
| `title` | Daily Quizzes | Text |
| `description` | New description | Text |
| `images` | [Select File] | File |
| `images` | [Select File] | File |
| `order` | 2 | Text |

### Response

```json
{
  "success": true,
  "message": "Section 4 card updated successfully",
  "data": {
    "_id": "69ec...",
    "title": "Daily Quiz (Updated)",
    "description": "Updated description",
    "images": [
      "https://res.cloudinary.com/.../new1.jpg",
      "https://res.cloudinary.com/.../new2.jpg"
    ],
    "order": 2,
    "isActive": true,
    "createdAt": "2026-04-25T10:00:00.000Z",
    "updatedAt": "2026-04-25T15:00:00.000Z"
  }
}
```

### Note: Image Replacement
- When you send new images, **old images are replaced**
- If you don't send images, old images remain unchanged

---

## 4. Delete Section 4 Card

**Endpoint:** `DELETE /section4/:id`

**Access:** Private (Super Admin only)

**Authentication Required:** Yes

### Testing with Postman

1. **Method:** DELETE
2. **URL:** `http://localhost:5000/api/section4/69ec...`
3. **Headers:**
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```

### Response

```json
{
  "success": true,
  "message": "Section 4 card deleted successfully"
}
```

### Note
- Deleting a card also removes its images from Cloudinary

---

## Homepage Integration

When you call `GET /api/homepage`, section4 is now fetched from the `HomeSection4` collection:

### Response Structure

```json
{
  "success": true,
  "data": {
    "section4": {
      "title": "ACCESS FREE LEARNING COURSES",
      "cards": [
        {
          "_id": "69ec...",
          "title": "Daily Quizzes",
          "description": "Participate in daily quizzes",
          "images": [
            "https://res.cloudinary.com/.../img1.jpg",
            "https://res.cloudinary.com/.../img2.jpg"
          ],
          "order": 1,
          "isActive": true
        },
        {
          "_id": "69ec...",
          "title": "Daily Current Affairs",
          "description": "Stay updated with daily CA",
          "images": [
            "https://res.cloudinary.com/.../ca1.jpg"
          ],
          "order": 2,
          "isActive": true
        }
      ]
    },
    "section7": {
      "videos": [...]
    }
  }
}
```

---

## Complete Code

### Model: `models/HomeSection4.js`

```javascript
const mongoose = require('mongoose');

const section4Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  images: [
    {
      type: String
    }
  ],
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Index for efficient queries
section4Schema.index({ order: 1 });
section4Schema.index({ isActive: 1 });

module.exports = mongoose.model('HomeSection4', section4Schema);
```

---

### Controller: `controllers/homeSection4Controller.js`

```javascript
const HomeSection4 = require('../models/HomeSection4');
const cloudinary = require('../config/cloudinary');

// Helper function to upload to Cloudinary
const uploadToCloudinary = async (file) => {
  if (!file) return null;
  
  try {
    if (file.buffer) {
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;
      
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'homepage/section4',
      });
      
      return result.secure_url;
    }
    
    if (file.path) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'homepage/section4',
      });
      
      return result.secure_url;
    }
    
    return null;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
};

// @desc    Create section 4 card
// @route   POST /api/home-section4
// @access  Private (Super Admin only)
exports.createSection4 = async (req, res) => {
  try {
    const { title, description, order } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'title and description are required'
      });
    }

    // Get image files
    const imageFiles = req.files.filter(f => f.fieldname === 'images');

    // Upload images to Cloudinary
    const imageUrls = [];
    for (const file of imageFiles) {
      const url = await uploadToCloudinary(file);
      imageUrls.push(url);
    }

    // Create card
    const card = await HomeSection4.create({
      title,
      description,
      images: imageUrls,
      order: order || 0
    });

    res.status(201).json({
      success: true,
      message: 'Section 4 card created successfully',
      data: card
    });

  } catch (err) {
    console.error('Create Section4 Error:', err);
    res.status(500).json({
      success: false,
      message: 'Error creating section 4 card',
      error: err.message
    });
  }
};

// @desc    Get all section 4 cards
// @route   GET /api/home-section4
// @access  Public
exports.getSection4 = async (req, res) => {
  try {
    const cards = await HomeSection4.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: cards.length,
      data: cards
    });

  } catch (err) {
    console.error('Get Section4 Error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching section 4 cards',
      error: err.message
    });
  }
};

// @desc    Update section 4 card
// @route   PUT /api/home-section4/:id
// @access  Private (Super Admin only)
exports.updateSection4 = async (req, res) => {
  try {
    const card = await HomeSection4.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found'
      });
    }

    const { title, description, order } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (order !== undefined) updateData.order = order;

    // Handle image updates
    const imageFiles = req.files.filter(f => f.fieldname === 'images');
    if (imageFiles.length > 0) {
      // Upload new images
      const imageUrls = [];
      for (const file of imageFiles) {
        const url = await uploadToCloudinary(file);
        imageUrls.push(url);
      }

      // Replace old images with new ones
      updateData.images = imageUrls;
    }

    const updatedCard = await HomeSection4.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Section 4 card updated successfully',
      data: updatedCard
    });

  } catch (err) {
    console.error('Update Section4 Error:', err);
    res.status(500).json({
      success: false,
      message: 'Error updating section 4 card',
      error: err.message
    });
  }
};

// @desc    Delete section 4 card
// @route   DELETE /api/home-section4/:id
// @access  Private (Super Admin only)
exports.deleteSection4 = async (req, res) => {
  try {
    const card = await HomeSection4.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found'
      });
    }

    // Delete images from Cloudinary
    if (card.images && card.images.length > 0) {
      for (const imageUrl of card.images) {
        try {
          const parts = imageUrl.split('/');
          const filename = parts[parts.length - 1];
          const publicId = filename.split('.')[0];
          await cloudinary.uploader.destroy(`homepage/section4/${publicId}`);
        } catch (err) {
          console.error('Error deleting image from Cloudinary:', err);
        }
      }
    }

    await HomeSection4.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Section 4 card deleted successfully'
    });

  } catch (err) {
    console.error('Delete Section4 Error:', err);
    res.status(500).json({
      success: false,
      message: 'Error deleting section 4 card',
      error: err.message
    });
  }
};
```

---

### Routes: `routes/homePageRoutes.js`

```javascript
// Section 4 Routes
router.route('/section4')
  .get(getSection4)
  .post(protect, authorize('super_admin'), upload.any(), createSection4);

router.route('/section4/:id')
  .put(protect, authorize('super_admin'), upload.any(), updateSection4)
  .delete(protect, authorize('super_admin'), deleteSection4);
```

---

## Quick Testing Checklist

### 1. Create Daily Quizzes Card
```bash
POST http://localhost:5000/api/section4
Authorization: Bearer TOKEN
FormData:
- title: Daily Quizzes
- description: Participate in daily quizzes
- images: [Upload 2-3 images]
- order: 1
```
✅ Card created with images

### 2. Create Current Affairs Card
```bash
POST http://localhost:5000/api/section4
FormData:
- title: Daily Current Affairs
- description: Stay updated with daily CA
- images: [Upload 1 image]
- order: 2
```
✅ Second card created

### 3. Get All Cards
```bash
GET http://localhost:5000/api/section4
```
✅ Returns both cards sorted by order

### 4. Update Card
```bash
PUT http://localhost:5000/api/section4/CARD_ID
FormData:
- title: Daily Quiz (Updated)
- images: [Upload new images]
```
✅ Card updated with new images

### 5. Check Homepage
```bash
GET http://localhost:5000/api/homepage
```
✅ section4.cards contains all cards

### 6. Delete Card
```bash
DELETE http://localhost:5000/api/section4/CARD_ID
Authorization: Bearer TOKEN
```
✅ Card deleted and images removed from Cloudinary

---

## Benefits of This Architecture

✅ **Scalable** - Add unlimited cards
✅ **Independent Updates** - Edit each card separately
✅ **Clean Image Management** - Upload images per card
✅ **Order Control** - Sort cards with `order` field
✅ **Active/Inactive** - Toggle cards with `isActive`
✅ **Better UX** - Admin panel can manage cards individually
✅ **No Re-upload** - Update one card without affecting others

---

## Common Use Cases

### Add New Learning Program
1. POST `/api/section4` with title, description, images
2. Set `order` to position it correctly
3. Card appears on homepage automatically

### Edit Existing Card
1. PUT `/api/section4/:id` with new data
2. Only send fields you want to update
3. Images replace old ones if sent

### Reorder Cards
1. Update `order` field on multiple cards
2. Cards sort by order on homepage

### Temporarily Hide Card
1. Set `isActive: false` (requires DB update or add to update endpoint)
2. Card won't appear on homepage but remains in DB

---

## Notes

- Images are stored in Cloudinary folder: `homepage/section4`
- Multiple images use same field name: `images`
- Cards sorted by `order` (ascending), then `createdAt` (descending)
- Only Super Admin can create/update/delete
- GET endpoint is public
- Deleting a card removes its images from Cloudinary
