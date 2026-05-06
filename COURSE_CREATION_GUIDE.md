# 🎓 Complete Course Creation Guide

Complete step-by-step guide with full code examples for creating and managing courses.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Login & Get Token](#step-1-login--get-token)
3. [Step 2: Create Centers](#step-2-create-centers)
4. [Step 3: Create Categories](#step-3-create-categories)
5. [Step 4: Create Course](#step-4-create-course)
6. [Step 5: Get Courses](#step-5-get-courses)
7. [Step 6: Update Course](#step-6-update-course)
8. [Step 7: Delete Course](#step-7-delete-course)
9. [Complete Code Examples](#complete-code-examples)
10. [Important Notes](#important-notes)
11. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before creating a course, ensure you have:

1. ✅ **Super Admin Account** (to create centers and categories)
2. ✅ **Server Running** (nodemon should be active)
3. ✅ **MongoDB Connected** (database is accessible)
4. ✅ **Cloudinary Configured** (for file uploads)
5. ✅ **Authentication Token** (JWT from login)

---

## ⚠️ IMPORTANT: Form-Data JSON Fields

**CRITICAL:** When sending JSON objects in form-data, you MUST use `JSON.stringify()`!

### ✅ CORRECT:
```javascript
formData.append('howItHelps', JSON.stringify({
  howItHelpsTitle: "How This Course Helps",
  howItHelpsTexts: ["text1", "text2"]
}));
```

### ❌ WRONG:
```javascript
// This will NOT work!
formData.append('howItHelpsTitle', 'How This Course Helps');
formData.append('howItHelpsTexts', '["text1", "text2"]');
```

**Applies to:** `keyHighlights`, `whyChoose`, `howItHelps`, `modes`, `extraFields`

---

## Step 1: Login & Get Token

### Request:
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@sriramias.com",
  "password": "your_password"
}
```

### Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user_id_here",
    "role": "super_admin",
    "email": "admin@sriramias.com"
  }
}
```

**Save the `token` value** - you'll need it for all subsequent requests.

---

## Step 2: Create Centers

### Create Delhi Center:
```bash
POST http://localhost:5000/api/admin/centers
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Delhi"
}
```

### Response:
```json
{
  "success": true,
  "message": "Center created successfully",
  "center": {
    "_id": "6789abcd1234efgh5678ijkl",
    "name": "Delhi",
    "createdAt": "2026-04-07T10:00:00.000Z",
    "updatedAt": "2026-04-07T10:00:00.000Z"
  }
}
```

**Save the center `_id`** - you'll need it for creating courses.

---

## Step 3: Create Categories

### Create GS Foundation Category:
```bash
POST http://localhost:5000/api/admin/categories
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "GS Foundation"
}
```

### Response:
```json
{
  "success": true,
  "message": "Category created successfully",
  "category": {
    "_id": "1234abcd5678efgh9012ijkl",
    "name": "GS Foundation",
    "createdAt": "2026-04-07T10:00:00.000Z",
    "updatedAt": "2026-04-07T10:00:00.000Z"
  }
}
```

**Save the category `_id`** - you'll need it for creating courses.

---

## Step 4: Create Course

### Complete Example - Delhi 2 Year GS Foundation:

```bash
POST http://localhost:5000/api/courses
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data
```

### Form Data:

```
# Basic Information
title: 2 Year GS Foundation Program
center: 6789abcd1234efgh5678ijkl          # Replace with your center ID
category: 1234abcd5678efgh9012ijkl          # Replace with your category ID
description: Comprehensive 2-year General Studies Foundation program for UPSC CSE preparation
duration: 2 Years
startDate: 2026-06-01                        # Format: YYYY-MM-DD OR text like "Admission open soon"
onlineFees: 150000
offlineFees: 180000
modes: ["online", "offline"]

# Key Highlights (Object with title and array of strings)
keyHighlights: {
  "keyTitle": "Course Highlights",
  "keyHighlightTexts": [
    "Learn from experienced UPSC mentors",
    "Complete study material provided",
    "Weekly assessments included",
    "Individual guidance for each student"
  ]
}

# Why Choose (Object with title and array of objects)
whyChoose: {
  "whyChooseTitle": "Why Choose Us",
  "whyChooseItems": [
    {"whyChooseText": "Proven Track Record", "whyChooseContent": "1000+ selections in last 5 years"},
    {"whyChooseText": "Small Batch Size", "whyChooseContent": "Maximum 30 students per batch"},
    {"whyChooseText": "Individual Attention", "whyChooseContent": "Personal mentorship for each student"},
    {"whyChooseText": "Updated Curriculum", "whyChooseContent": "Latest syllabus and exam pattern"}
  ]
}

# How It Helps (Object with title and array of strings)
howItHelps: {
  "howItHelpsTitle": "How This Course Helps You",
  "howItHelpsTexts": [
    "Build a strong foundation with NCERTs and conceptual lectures",
    "Gain exam orientation through regular MCQs, Mains questions and answer writing",
    "Stay updated and integrated with current affairs seamlessly woven into your syllabus",
    "Develop discipline and consistency with a structured timeline, reviews and progress tracking",
    "Revise effectively with our unique Revision Booklet and extended access to resources",
    "Receive continuous mentorship and motivation throughout your preparation journey"
  ]
}

# Files (Upload actual files)
banner: [Upload banner image - Required]     # JPEG, PNG, WebP, AVIF
highlight: [Upload highlight image]          # JPEG, PNG, WebP, AVIF (Optional)
section: [Upload section image]              # JPEG, PNG, WebP, AVIF (Optional)
gallery: [Upload up to 5 images]             # JPEG, PNG, WebP, AVIF (Optional)
video: [Upload promo video]                  # MP4, GIF (Optional)
brochure: [Upload PDF brochure]              # PDF only (Optional)
```

### Success Response:
```json
{
  "success": true,
  "message": "Course created successfully",
  "course": {
    "_id": "course_id_here",
    "title": "2 Year GS Foundation Program",
    "slug": "2-year-gs-foundation-program-1712345678901",
    "center": {
      "_id": "6789abcd1234efgh5678ijkl",
      "name": "Delhi"
    },
    "category": {
      "_id": "1234abcd5678efgh9012ijkl",
      "name": "GS Foundation"
    },
    "description": "Comprehensive 2-year General Studies Foundation program for UPSC CSE preparation",
    "startDate": "2026-06-01T00:00:00.000Z",
    "duration": "2 Years",
    "fees": {
      "online": 150000,
      "offline": 180000
    },
    "modes": ["online", "offline"],
    "keyHighlights": {
      "keyTitle": "Course Highlights",
      "keyHighlightTexts": [
        "Learn from experienced UPSC mentors",
        "Complete study material provided",
        "Weekly assessments included",
        "Individual guidance for each student"
      ]
    },
    "whyChoose": {
      "whyChooseTitle": "Why Choose Us",
      "whyChooseItems": [
        {
          "whyChooseText": "Proven Track Record",
          "whyChooseContent": "1000+ selections in last 5 years"
        },
        {
          "whyChooseText": "Small Batch Size",
          "whyChooseContent": "Maximum 30 students per batch"
        }
      ]
    },
    "howItHelps": {
      "howItHelpsTitle": "How This Course Helps You",
      "howItHelpsTexts": [
        "Build a strong foundation with NCERTs and conceptual lectures",
        "Gain exam orientation through regular MCQs, Mains questions and answer writing",
        "Stay updated and integrated with current affairs seamlessly woven into your syllabus",
        "Develop discipline and consistency with a structured timeline, reviews and progress tracking",
        "Revise effectively with our unique Revision Booklet and extended access to resources",
        "Receive continuous mentorship and motivation throughout your preparation journey"
      ]
    },
    "bannerImage": {
      "url": "https://res.cloudinary.com/dqtasamcu/image/upload/v1234/courses/banners/xyz.jpg",
      "public_id": "courses/banners/xyz"
    },
    "brochure": {
      "url": "https://res.cloudinary.com/dqtasamcu/raw/upload/v1234/courses/brochures/abc",
      "public_id": "courses/brochures/abc"
    },
    "isActive": true,
    "isFeatured": false,
    "createdAt": "2026-04-07T10:00:00.000Z",
    "updatedAt": "2026-04-07T10:00:00.000Z"
  }
}
```

**✅ Note:** 
- `center` and `category` are fully populated with names (not just IDs)
- `brochure` URL is the exact Cloudinary URL (no manual .pdf extension added)
- All content sections (`keyHighlights`, `whyChoose`, `howItHelps`) are properly parsed and stored

---

## Step 5: Get Courses

### Get All Courses (Public - No Auth Required):
```bash
GET http://localhost:5000/api/courses
```
**Returns:** All courses (no limit by default)

### Get Courses with Pagination:
```bash
GET http://localhost:5000/api/courses?limit=10&page=1
```

### Get All Courses Explicitly:
```bash
GET http://localhost:5000/api/courses?limit=all
```

### Filter by Center Name:
```bash
GET http://localhost:5000/api/courses?centerName=Delhi
```

### Filter by Category Name:
```bash
GET http://localhost:5000/api/courses?categoryName=GS Foundation
```

### Get Course by ID:
```bash
GET http://localhost:5000/api/courses/COURSE_ID_HERE
```

### Get Course by Slug:
```bash
GET http://localhost:5000/api/courses/slug/2-year-gs-foundation-program-1712345678901
```

### Response Example:
```json
{
  "success": true,
  "count": 1,
  "total": 1,
  "page": 1,
  "pages": 1,
  "courses": [
    {
      "_id": "course_id",
      "title": "2 Year GS Foundation Program",
      "slug": "2-year-gs-foundation-program-1712345678901",
      "center": {
        "_id": "center_id",
        "name": "Delhi"
      },
      "category": {
        "_id": "category_id",
        "name": "GS Foundation"
      },
      "description": "Comprehensive 2-year program",
      "startDate": "2026-06-01T00:00:00.000Z",
      "duration": "2 Years",
      "fees": {
        "online": 150000,
        "offline": 180000
      },
      "modes": ["online", "offline"],
      "keyHighlights": {
        "keyTitle": "Course Highlights",
        "keyHighlightTexts": ["..."]
      },
      "whyChoose": {
        "whyChooseTitle": "Why Choose Us",
        "whyChooseItems": [...]
      },
      "howItHelps": {
        "howItHelpsTitle": "How This Course Helps You",
        "howItHelpsTexts": ["..."]
      },
      "bannerImage": {
        "url": "https://...",
        "public_id": "courses/banners/xyz"
      },
      "brochure": {
        "url": "https://res.cloudinary.com/.../courses/brochures/abc",
        "public_id": "courses/brochures/abc"
      },
      "isActive": true,
      "createdAt": "2026-04-07T10:00:00.000Z"
    }
  ]
}
```

**✅ Note:** All courses include populated `center` and `category` with names!

---

## Step 6: Update Course

### Partial Update (Send only fields you want to change):

```bash
PUT http://localhost:5000/api/courses/COURSE_ID_HERE
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data
```

### ✅ Example 1: Update only fees

```javascript
formData.append('onlineFees', '160000');
formData.append('offlineFees', '190000');
// Only fees will be updated, everything else remains unchanged
```

### ✅ Example 2: Update only startDate

```javascript
formData.append('startDate', '2026-08-01');
// Or: formData.append('startDate', 'Admission open soon');
```

### ✅ Example 3: Update only extraFields

```javascript
formData.append('extraFields', JSON.stringify({
  mentorshipFeatures: ["1:1 call", "Strategy Session"]
}));
```

### ✅ Example 4: Update multiple fields

```javascript
formData.append('title', 'Updated Course Title');
formData.append('onlineFees', '160000');
formData.append('duration', '2 Years');
formData.append('keyHighlights', JSON.stringify({
  keyTitle: 'Updated Highlights',
  keyHighlightTexts: ['New highlight 1', 'New highlight 2']
}));
```

### ✅ Example 5: Update files only

```javascript
formData.append('banner', newBannerFile); // Replaces old banner
formData.append('brochure', newBrochureFile); // Replaces old brochure
// Old files automatically deleted from Cloudinary
```

### Response:
```json
{
  "success": true,
  "message": "Course updated successfully",
  "course": {
    // Updated course object with populated center and category
  }
}
```

### ⚠️ Important Notes:

1. **Partial Updates:** Only send fields you want to change
2. **Nested Fields:** `onlineFees` and `offlineFees` update `fees.online` and `fees.offline` separately (no data loss)
3. **JSON Fields:** Must use `JSON.stringify()` for `keyHighlights`, `whyChoose`, `howItHelps`, `extraFields`
4. **Files:** Only uploaded if provided, old files automatically deleted
5. **startDate:** Accepts both dates (`2026-06-01`) and text (`Admission open soon`)

---

## Step 7: Delete Course

```bash
DELETE http://localhost:5000/api/courses/COURSE_ID_HERE
Authorization: Bearer YOUR_TOKEN_HERE
```

### Response:
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

---

## Complete Code Examples

### Backend Code

#### 1. Course Model (`models/Course.js`)

```javascript
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  slug: {
    type: String,
    sparse: true // Allows null values but ensures uniqueness when present
  },
  
  center: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Center',
    required: true
  },
  
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  
  description: String,
  
  startDate: Date,
  duration: String, // "1 Year", "2 Years", "6 Months"
  
  fees: {
    online: Number,
    offline: Number,
    description: String
  },
  
  modes: [{
    type: String,
    enum: ['online', 'offline', 'hybrid']
  }],
  
  // Media (Cloudinary URLs)
  bannerImage: {
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  },
  highlightImage: {
    url: String,
    public_id: String
  },
  sectionImage: {
    url: String,
    public_id: String
  },
  
  galleryImages: [{
    url: String,
    public_id: String
  }],
  
  promoVideo: {
    url: String,
    public_id: String
  },
  
  // Content Sections
  keyHighlights: {
    keyTitle: String,
    keyHighlightTexts: [String]
  },
  
  whyChoose: {
    whyChooseTitle: String,
    whyChooseItems: [{
      whyChooseText: String,
      whyChooseContent: String
    }]
  },
  
  howItHelps: {
    howItHelpsTitle: String,
    howItHelpsTexts: [String]
  },
  
  // Extra Fields (Flexible content for category-specific data)
  extraFields: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Additional Info
  brochure: {
    url: String,
    public_id: String
  },
  features: [String],
  
  // Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
  
}, { timestamps: true });

// Generate slug from title before saving
courseSchema.pre('save', async function() {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
});

// Index for faster queries
courseSchema.index({ center: 1, category: 1 });
courseSchema.index({ isActive: 1 });
courseSchema.index({ slug: 1 });

module.exports = mongoose.model('Course', courseSchema);
```

#### 2. Course Controller (`controllers/courseController.js`)

```javascript
const Course = require('../models/Course');
const Center = require('../models/Center');
const Category = require('../models/Category');
const uploadToCloudinary = require('../utils/uploadToCloudinary');
const cloudinary = require('../config/cloudinary');

// Helper function to delete old image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
    }
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Super Admin, Center Admin)
exports.createCourse = async (req, res) => {
  try {
    const user = req.user;
    const {
      title,
      center,
      category,
      description,
      startDate,
      duration,
      onlineFees,
      offlineFees,
      modes,
      keyHighlights,
      whyChoose,
      howItHelps
    } = req.body;

    // Validate required fields
    if (!title || !center || !category) {
      return res.status(400).json({ 
        message: 'Required fields missing: title, center, and category are required' 
      });
    }

    // Parse startDate if provided (handle various date formats)
    let parsedStartDate = null;
    if (startDate) {
      parsedStartDate = new Date(startDate);
      if (isNaN(parsedStartDate.getTime())) {
        return res.status(400).json({ 
          message: 'Invalid date format for startDate. Use YYYY-MM-DD format (e.g., 2026-03-27)' 
        });
      }
    }

    // Validate center exists
    const centerDoc = await Center.findById(center);
    
    if (!centerDoc) {
      return res.status(404).json({ message: 'Center not found' });
    }

    // Role-based access check with center admin validation
    if (user.role === 'center_admin') {
      // Check if user is actually the admin of this center
      if (!centerDoc.centerAdmin || !centerDoc.centerAdmin.equals(user._id)) {
        return res.status(403).json({ 
          message: 'Access denied. You are not the admin of this center.' 
        });
      }
    }

    // Validate banner image
    const files = req.files;
    
    if (!files || !files.banner) {
      return res.status(400).json({ message: 'Banner image is required' });
    }

    // Upload all files in PARALLEL for faster processing
    const uploadPromises = [];

    // Upload banner image (required)
    uploadPromises.push(
      uploadToCloudinary(files.banner[0], 'courses/banners')
        .then(result => ({ type: 'banner', result }))
    );

    // Upload highlight image (optional)
    if (files.highlight) {
      uploadPromises.push(
        uploadToCloudinary(files.highlight[0], 'courses/highlights')
          .then(result => ({ type: 'highlight', result }))
      );
    }

    // Upload section image (optional)
    if (files.section) {
      uploadPromises.push(
        uploadToCloudinary(files.section[0], 'courses/sections')
          .then(result => ({ type: 'section', result }))
      );
    }

    // Upload gallery images (optional)
    if (files.gallery) {
      files.gallery.forEach((file, index) => {
        uploadPromises.push(
          uploadToCloudinary(file, 'courses/gallery')
            .then(result => ({ type: 'gallery', index, result }))
        );
      });
    }

    // Upload promo video (optional)
    if (files.video) {
      uploadPromises.push(
        uploadToCloudinary(files.video[0], 'courses/videos')
          .then(result => ({ type: 'video', result }))
      );
    }

    // Upload brochure PDF (optional)
    if (files.brochure) {
      uploadPromises.push(
        uploadToCloudinary(files.brochure[0], 'courses/brochures', 'raw', 'pdf')
          .then(result => ({ type: 'brochure', result }))
      );
    }

    // Wait for all uploads to complete in parallel
    const uploadResults = await Promise.all(uploadPromises);

    // Process upload results
    let bannerImage = null;
    let highlightImage = null;
    let sectionImage = null;
    let galleryImages = [];
    let promoVideo = null;
    let brochure = null;

    for (const upload of uploadResults) {
      switch (upload.type) {
        case 'banner':
          bannerImage = { url: upload.result.url, public_id: upload.result.public_id };
          break;
        case 'highlight':
          highlightImage = { url: upload.result.url, public_id: upload.result.public_id };
          break;
        case 'section':
          sectionImage = { url: upload.result.url, public_id: upload.result.public_id };
          break;
        case 'gallery':
          galleryImages.push({ url: upload.result.url, public_id: upload.result.public_id });
          break;
        case 'video':
          promoVideo = { url: upload.result.url, public_id: upload.result.public_id };
          break;
        case 'brochure':
          brochure = { url: upload.result.url, public_id: upload.result.public_id };
          break;
      }
    }

    // Parse content sections with safe parsing
    let parsedKeyHighlights = {};
    if (req.body.keyHighlights) {
      try {
        parsedKeyHighlights = typeof req.body.keyHighlights === 'string' 
          ? JSON.parse(req.body.keyHighlights) 
          : req.body.keyHighlights;
      } catch (err) {
        console.error('❌ keyHighlights parse error:', err);
      }
    }

    let parsedWhyChoose = {};
    if (req.body.whyChoose) {
      try {
        parsedWhyChoose = typeof req.body.whyChoose === 'string' 
          ? JSON.parse(req.body.whyChoose) 
          : req.body.whyChoose;
      } catch (err) {
        console.error('❌ whyChoose parse error:', err);
      }
    }

    let parsedHowItHelps = {};
    if (req.body.howItHelps) {
      try {
        parsedHowItHelps = typeof req.body.howItHelps === 'string' 
          ? JSON.parse(req.body.howItHelps) 
          : req.body.howItHelps;
      } catch (err) {
        console.error('❌ howItHelps parse error:', err);
      }
    }

    // Create course
    const course = await Course.create({
      title,
      center,
      category,
      description,
      startDate: parsedStartDate,
      duration,
      fees: {
        online: onlineFees,
        offline: offlineFees
      },
      modes: modes ? (typeof modes === 'string' ? JSON.parse(modes) : modes) : ['online', 'offline'],
      bannerImage: { url: bannerImage.url, public_id: bannerImage.public_id },
      highlightImage: highlightImage ? { url: highlightImage.url, public_id: highlightImage.public_id } : null,
      sectionImage: sectionImage ? { url: sectionImage.url, public_id: sectionImage.public_id } : null,
      galleryImages,
      promoVideo,
      brochure,
      keyHighlights: parsedKeyHighlights,
      whyChoose: parsedWhyChoose,
      howItHelps: parsedHowItHelps,
      createdBy: user._id
    });

    // Populate center and category before returning
    const populatedCourse = await Course.findById(course._id)
      .populate('center', 'name')
      .populate('category', 'name');

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course: populatedCourse
    });

  } catch (error) {
    console.error('Create Course Error:', error);
    res.status(500).json({ 
      message: 'Error creating course', 
      error: error.message 
    });
  }
};

// @desc    Get all courses (with filters)
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
  try {
    const { center, category, isActive, isFeatured, centerName, categoryName, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = {};
    
    // Support both ID-based and name-based filtering
    if (center) filter.center = center;
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (isFeatured) filter.isFeatured = true;

    // Name-based filters (will query after getting IDs)
    let centerQuery = {};
    let categoryQuery = {};

    if (centerName) {
      const centers = await Center.find({ name: new RegExp(centerName, 'i') });
      if (centers.length > 0) {
        filter.center = { $in: centers.map(c => c._id) };
      } else {
        // No matching centers
        return res.json({
          success: true,
          count: 0,
          courses: [],
          message: `No courses found for center: ${centerName}`
        });
      }
    }

    if (categoryName) {
      const categories = await Category.find({ name: new RegExp(categoryName, 'i') });
      if (categories.length > 0) {
        filter.category = { $in: categories.map(c => c._id) };
      } else {
        // No matching categories
        return res.json({
          success: true,
          count: 0,
          courses: [],
          message: `No courses found for category: ${categoryName}`
        });
      }
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const courses = await Course.find(filter)
      .populate('center', 'name')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Course.countDocuments(filter);

    res.json({
      success: true,
      count: courses.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      courses
    });

  } catch (error) {
    console.error('Get Courses Error:', error);
    res.status(500).json({ 
      message: 'Error fetching courses', 
      error: error.message 
    });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('center', 'name')
      .populate('category', 'name');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({
      success: true,
      course
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching course', 
      error: error.message 
    });
  }
};

// @desc    Get single course by slug
// @route   GET /api/courses/slug/:slug
// @access  Public
exports.getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate('center', 'name')
      .populate('category', 'name');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({
      success: true,
      course
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching course', 
      error: error.message 
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Super Admin, Center Admin)
exports.updateCourse = async (req, res) => {
  try {
    const user = req.user;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check access with proper center admin validation
    if (user.role === 'center_admin') {
      const centerDoc = await Center.findById(course.center);
      
      if (!centerDoc || !centerDoc.centerAdmin || !centerDoc.centerAdmin.equals(user._id)) {
        return res.status(403).json({ 
          message: 'Access denied. You can only edit courses for your center.' 
        });
      }
    }

    // Update fields
    const updates = req.body;
    
    // Handle file uploads (if any new files) and delete old ones
    if (req.files) {
      const files = req.files;
      
      // First, delete all old files in parallel
      const deletePromises = [];
      
      if (files.banner) {
        deletePromises.push(deleteFromCloudinary(course.bannerImage?.public_id));
      }
      if (files.highlight) {
        deletePromises.push(deleteFromCloudinary(course.highlightImage?.public_id));
      }
      if (files.section) {
        deletePromises.push(deleteFromCloudinary(course.sectionImage?.public_id));
      }
      if (files.gallery && course.galleryImages && course.galleryImages.length > 0) {
        course.galleryImages.forEach(img => {
          deletePromises.push(deleteFromCloudinary(img.public_id));
        });
      }
      if (files.video) {
        deletePromises.push(deleteFromCloudinary(course.promoVideo?.public_id));
      }
      if (files.brochure) {
        deletePromises.push(deleteFromCloudinary(course.brochure?.public_id));
      }
      
      // Delete old files in parallel
      await Promise.all(deletePromises);
      
      // Now upload new files in parallel
      const uploadPromises = [];
      
      if (files.banner) {
        uploadPromises.push(
          uploadToCloudinary(files.banner[0], 'courses/banners')
            .then(result => ({ type: 'banner', result }))
        );
      }
      
      if (files.highlight) {
        uploadPromises.push(
          uploadToCloudinary(files.highlight[0], 'courses/highlights')
            .then(result => ({ type: 'highlight', result }))
        );
      }
      
      if (files.section) {
        uploadPromises.push(
          uploadToCloudinary(files.section[0], 'courses/sections')
            .then(result => ({ type: 'section', result }))
        );
      }
      
      if (files.gallery) {
        files.gallery.forEach((file, index) => {
          uploadPromises.push(
            uploadToCloudinary(file, 'courses/gallery')
              .then(result => ({ type: 'gallery', index, result }))
          );
        });
      }
      
      if (files.video) {
        uploadPromises.push(
          uploadToCloudinary(files.video[0], 'courses/videos')
            .then(result => ({ type: 'video', result }))
        );
      }
      
      if (files.brochure) {
        uploadPromises.push(
          uploadToCloudinary(files.brochure[0], 'courses/brochures', 'raw', 'pdf')
            .then(result => ({ type: 'brochure', result }))
        );
      }
      
      // Wait for all uploads to complete in parallel
      const uploadResults = await Promise.all(uploadPromises);
      
      // Process upload results
      let newGalleryImages = [];
      
      for (const upload of uploadResults) {
        switch (upload.type) {
          case 'banner':
            updates.bannerImage = { url: upload.result.url, public_id: upload.result.public_id };
            break;
          case 'highlight':
            updates.highlightImage = { url: upload.result.url, public_id: upload.result.public_id };
            break;
          case 'section':
            updates.sectionImage = { url: upload.result.url, public_id: upload.result.public_id };
            break;
          case 'gallery':
            newGalleryImages.push({ url: upload.result.url, public_id: upload.result.public_id });
            break;
          case 'video':
            updates.promoVideo = { url: upload.result.url, public_id: upload.result.public_id };
            break;
          case 'brochure':
            updates.brochure = { url: upload.result.url, public_id: upload.result.public_id };
            break;
        }
      }
      
      // Set gallery images if any were uploaded
      if (newGalleryImages.length > 0) {
        updates.galleryImages = newGalleryImages;
      }
    }

    // Parse JSON strings for array fields with safe parsing
    if (updates.keyHighlights) {
      try {
        if (typeof updates.keyHighlights === 'string') {
          updates.keyHighlights = JSON.parse(updates.keyHighlights);
        }
      } catch (err) {
        console.error('❌ keyHighlights parse error:', err);
      }
    }
    if (updates.whyChoose) {
      try {
        if (typeof updates.whyChoose === 'string') {
          updates.whyChoose = JSON.parse(updates.whyChoose);
        }
      } catch (err) {
        console.error('❌ whyChoose parse error:', err);
      }
    }
    if (updates.howItHelps) {
      try {
        if (typeof updates.howItHelps === 'string') {
          updates.howItHelps = JSON.parse(updates.howItHelps);
        }
      } catch (err) {
        console.error('❌ howItHelps parse error:', err);
      }
    }
    if (updates.modes && typeof updates.modes === 'string') {
      updates.modes = JSON.parse(updates.modes);
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('center', 'name')
     .populate('category', 'name');

    res.json({
      success: true,
      message: 'Course updated successfully',
      course: updatedCourse
    });

  } catch (error) {
    console.error('Update Course Error:', error);
    res.status(500).json({ 
      message: 'Error updating course', 
      error: error.message 
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Super Admin only)
exports.deleteCourse = async (req, res) => {
  try {
    const user = req.user;
    
    // Only Super Admin can delete
    if (user.role !== 'super_admin') {
      return res.status(403).json({ 
        message: 'Access denied. Only Super Admin can delete courses.' 
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Delete all associated images/videos from Cloudinary
    await deleteFromCloudinary(course.bannerImage?.public_id);
    await deleteFromCloudinary(course.highlightImage?.public_id);
    await deleteFromCloudinary(course.sectionImage?.public_id);
    
    if (course.galleryImages && course.galleryImages.length > 0) {
      for (let img of course.galleryImages) {
        await deleteFromCloudinary(img.public_id);
      }
    }
    
    await deleteFromCloudinary(course.promoVideo?.public_id);
    await deleteFromCloudinary(course.brochure?.public_id);

    // Delete course from database
    await Course.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting course', 
      error: error.message 
    });
  }
};
```

#### 3. Course Routes (`routes/courseRoutes.js`)

```javascript
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const protect = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');
const {
  createCourse,
  getCourses,
  getCourseById,
  getCourseBySlug,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');

// ==========================================
// PUBLIC ROUTES (No authentication needed)
// ==========================================
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.get('/slug/:slug', getCourseBySlug);

// ==========================================
// ADMIN ROUTES (Protected)
// ==========================================

// Create course - Super Admin & Center Admin
router.post(
  '/',
  protect,
  allowRoles('super_admin', 'center_admin'),
  upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'highlight', maxCount: 1 },
    { name: 'section', maxCount: 1 },
    { name: 'gallery', maxCount: 5 },
    { name: 'video', maxCount: 1 },
    { name: 'brochure', maxCount: 1 }
  ]),
  createCourse
);

// Update course - Super Admin & Center Admin
router.put(
  '/:id',
  protect,
  allowRoles('super_admin', 'center_admin'),
  upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'highlight', maxCount: 1 },
    { name: 'section', maxCount: 1 },
    { name: 'gallery', maxCount: 5 },
    { name: 'video', maxCount: 1 },
    { name: 'brochure', maxCount: 1 }
  ]),
  updateCourse
);

// Delete course - Super Admin only
router.delete(
  '/:id',
  protect,
  allowRoles('super_admin'),
  deleteCourse
);

module.exports = router;
```

#### 4. Upload Middleware (`middleware/upload.js`)

```javascript
const multer = require('multer');

// Store in memory (for Cloudinary upload)
const storage = multer.memoryStorage();

// File filter (images + videos + PDF only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif',
    'video/mp4',
    'application/pdf'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, AVIF, GIF, MP4, and PDF allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

module.exports = upload;
```

#### 5. Cloudinary Upload Utility (`utils/uploadToCloudinary.js`)

```javascript
const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (file, folder = 'courses', resourceType = 'auto', format = null) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: folder,
      resource_type: resourceType // 'auto' for images/videos, 'raw' for PDFs
    };

    // Add format if specified (e.g., 'pdf' for brochures)
    if (format) {
      uploadOptions.format = format;
    }

    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format
          });
        }
      }
    ).end(file.buffer);
  });
};

module.exports = uploadToCloudinary;
```

#### 6. Related Models

**Center Model (`models/Center.js`):**

```javascript
const mongoose = require('mongoose');

const centerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  centerAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Center', centerSchema);
```

**Category Model (`models/Category.js`):**

```javascript
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
```

### JavaScript/Frontend Example:

```javascript
// Create Course Function
async function createCourse(courseData, files) {
  const formData = new FormData();
  
  // Add basic fields
  formData.append('title', courseData.title);
  formData.append('center', courseData.centerId);
  formData.append('category', courseData.categoryId);
  formData.append('description', courseData.description);
  formData.append('duration', courseData.duration);
  formData.append('startDate', courseData.startDate); // YYYY-MM-DD
  formData.append('onlineFees', courseData.onlineFees);
  formData.append('offlineFees', courseData.offlineFees);
  formData.append('modes', JSON.stringify(courseData.modes));
  
  // Add content sections (as JSON strings)
  formData.append('keyHighlights', JSON.stringify(courseData.keyHighlights));
  formData.append('whyChoose', JSON.stringify(courseData.whyChoose));
  formData.append('howItHelps', JSON.stringify(courseData.howItHelps));
  
  // Add extra fields for category-specific data (optional)
  if (courseData.extraFields) {
    formData.append('extraFields', JSON.stringify(courseData.extraFields));
  }
  
  // Add files
  if (files.banner) formData.append('banner', files.banner);
  if (files.highlight) formData.append('highlight', files.highlight);
  if (files.section) formData.append('section', files.section);
  if (files.gallery) {
    files.gallery.forEach(file => formData.append('gallery', file));
  }
  if (files.video) formData.append('video', files.video);
  if (files.brochure) formData.append('brochure', files.brochure);
  
  // Make API request
  const response = await fetch('http://localhost:5000/api/courses', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${YOUR_TOKEN}`
    },
    body: formData
  });
  
  return await response.json();
}

// Usage Example:
const courseData = {
  title: '2 Year GS Foundation Program',
  centerId: '6789abcd1234efgh5678ijkl',
  categoryId: '1234abcd5678efgh9012ijkl',
  description: 'Comprehensive UPSC preparation',
  duration: '2 Years',
  startDate: '2026-06-01',
  onlineFees: 150000,
  offlineFees: 180000,
  modes: ['online', 'offline'],
  keyHighlights: {
    keyTitle: 'Course Highlights',
    keyHighlightTexts: [
      'Expert faculty',
      'Study material',
      'Mock tests'
    ]
  },
  whyChoose: {
    whyChooseTitle: 'Why Choose Us',
    whyChooseItems: [
      { whyChooseText: 'Proven Results', whyChooseContent: '1000+ selections' },
      { whyChooseText: 'Small Batches', whyChooseContent: 'Max 30 students' }
    ]
  },
  howItHelps: {
    howItHelpsTitle: 'How This Course Helps',
    howItHelpsTexts: [
      'Strong foundation',
      'Answer writing skills',
      'Current affairs'
    ]
  }
};

const files = {
  banner: document.getElementById('banner-input').files[0],
  brochure: document.getElementById('brochure-input').files[0]
};

createCourse(courseData, files)
  .then(response => console.log('Course created:', response))
  .catch(error => console.error('Error:', error));
```

### Mentorship Course Example (with extraFields):

```javascript
// Mentorship course with category-specific data
const mentorshipCourseData = {
  title: 'UPSC Mentorship Program',
  centerId: '6789abcd1234efgh5678ijkl',
  categoryId: 'mentorship_category_id',
  description: 'Comprehensive mentorship program with 1-on-1 guidance from toppers',
  duration: '1 Year',
  startDate: '2026-07-01',
  onlineFees: 50000,
  offlineFees: 70000,
  modes: ['online', 'offline'],
  keyHighlights: {
    keyTitle: 'Program Highlights',
    keyHighlightTexts: [
      '1-on-1 mentorship from UPSC toppers',
      'Weekly progress reviews',
      'Personalized study plan',
      '24/7 doubt support'
    ]
  },
  whyChoose: {
    whyChooseTitle: 'Why Choose This Program',
    whyChooseItems: [
      { whyChooseText: 'Proven Results', whyChooseContent: '500+ selections in 2025' },
      { whyChooseText: 'Expert Mentors', whyChooseContent: 'Learn from rank holders' }
    ]
  },
  howItHelps: {
    howItHelpsTitle: 'How This Program Helps',
    howItHelpsTexts: [
      'Clear roadmap for UPSC preparation',
      'Regular answer writing practice',
      'Continuous motivation and guidance'
    ]
  },
  // Category-specific extra fields
  extraFields: {
    commonDilemmas: [
      'When to start answer writing practice?',
      'How to balance prelims and mains preparation?',
      'Which optional subject to choose?',
      'How to manage time effectively?'
    ],
    programPhases: [
      'Phase 1: Foundation - Concept building and NCERT completion',
      'Phase 2: Practice - Answer writing and test series',
      'Phase 3: Revision - Intensive mock tests and current affairs'
    ],
    mentorshipFeatures: [
      'Weekly 1-on-1 sessions with mentor',
      'Personalized study plan based on your strengths',
      'Monthly progress assessment',
      'Dedicated doubt clearing sessions',
      'Access to exclusive study material'
    ]
  }
};

const files = {
  banner: document.getElementById('banner-input').files[0],
  brochure: document.getElementById('brochure-input').files[0]
};

createCourse(mentorshipCourseData, files)
  .then(response => console.log('Mentorship course created:', response))
  .catch(error => console.error('Error:', error));
```

### cURL Complete Example:

```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=2 Year GS Foundation Program" \
  -F "center=6789abcd1234efgh5678ijkl" \
  -F "category=1234abcd5678efgh9012ijkl" \
  -F "description=Comprehensive UPSC preparation" \
  -F "duration=2 Years" \
  -F "startDate=2026-06-01" \
  -F "onlineFees=150000" \
  -F "offlineFees=180000" \
  -F "modes=[\"online\",\"offline\"]" \
  -F 'keyHighlights={"keyTitle":"Course Highlights","keyHighlightTexts":["Expert faculty","Study material","Mock tests"]}' \
  -F 'whyChoose={"whyChooseTitle":"Why Choose Us","whyChooseItems":[{"whyChooseText":"Proven Results","whyChooseContent":"1000+ selections"},{"whyChooseText":"Small Batches","whyChooseContent":"Max 30 students"}]}' \
  -F 'howItHelps={"howItHelpsTitle":"How This Course Helps","howItHelpsTexts":["Strong foundation","Answer writing","Current affairs"]}' \
  -F 'extraFields={}' \
  -F "banner=@/path/to/banner.jpg" \
  -F "brochure=@/path/to/brochure.pdf"
```

**⚠️ Important:** Notice how `keyHighlights`, `whyChoose`, and `howItHelps` are sent as JSON strings (wrapped in quotes)!

### Postman Setup:

1. **Method:** POST
2. **URL:** `http://localhost:5000/api/courses`
3. **Headers:**
   ```
   Authorization: Bearer YOUR_TOKEN_HERE
   ```
4. **Body → form-data:**

| Key | Value | Type |
|-----|-------|------|
| title | 2 Year GS Foundation Program | Text |
| center | 6789abcd1234efgh5678ijkl | Text |
| category | 1234abcd5678efgh9012ijkl | Text |
| description | Comprehensive UPSC preparation | Text |
| duration | 2 Years | Text |
| startDate | 2026-06-01 | Text |
| onlineFees | 150000 | Text |
| offlineFees | 180000 | Text |
| modes | ["online", "offline"] | Text |
| keyHighlights | `{"keyTitle":"Course Highlights","keyHighlightTexts":["Expert faculty","Study material"]}` | Text |
| whyChoose | `{"whyChooseTitle":"Why Choose Us","whyChooseItems":[{"whyChooseText":"Proven Results","whyChooseContent":"1000+ selections"}]}` | Text |
| howItHelps | `{"howItHelpsTitle":"How This Course Helps","howItHelpsTexts":["Strong foundation","Answer writing"]}` | Text |
| extraFields | `{}` or `{"commonDilemmas":["When to start?"],"programPhases":["Phase 1"]}` | Text |
| banner | [Select File] | File |
| brochure | [Select File] | File |

---

## Important Notes

### ⚠️ CRITICAL: Form-Data JSON Format

When using multipart/form-data, you **MUST** stringify JSON objects:

**Frontend (JavaScript):**
```javascript
formData.append('howItHelps', JSON.stringify({
  howItHelpsTitle: "How This Course Helps",
  howItHelpsTexts: ["text1", "text2"]
}));
```

**Postman:**
- Set Type to `Text` (not File)
- Value: `{"howItHelpsTitle":"Title","howItHelpsTexts":["text1","text2"]}`

**cURL:**
- Wrap JSON in single quotes: `-F 'howItHelps={"key":"value"}'`

---

### File Types Supported:
- **Images:** JPEG, PNG, WebP, AVIF
- **Videos:** MP4, GIF
- **Documents:** PDF (for brochure only)

### Date Format:
- ✅ **Correct (Date):** `2026-06-01` (YYYY-MM-DD)
- ✅ **Correct (Text):** `Admission open soon` or `Starting July 2026`
- ❌ **Wrong:** `June 1, 2026` or `01/06/2026` (ambiguous formats)

**Note:** The `startDate` field now accepts both actual dates AND text messages. The backend automatically detects which one you're using!

#### Examples:

**With actual date:**
```javascript
formData.append('startDate', '2026-06-01');
// Stored as: Date object in MongoDB
```

**With text message:**
```javascript
formData.append('startDate', 'Admission open soon');
// Stored as: String in MongoDB

// Or:
formData.append('startDate', 'Starting July 2026');
formData.append('startDate', 'Registrations open');
formData.append('startDate', 'Coming Soon');
```

### Content Structure:

**keyHighlights:** One title + array of strings
```json
{
  "keyTitle": "Course Highlights",
  "keyHighlightTexts": ["text1", "text2", "text3"]
}
```

**whyChoose:** One title + array of objects
```json
{
  "whyChooseTitle": "Why Choose Us",
  "whyChooseItems": [
    {"whyChooseText": "Title", "whyChooseContent": "Description"},
    {"whyChooseText": "Title", "whyChooseContent": "Description"}
  ]
}
```

**howItHelps:** One title + array of strings
```json
{
  "howItHelpsTitle": "How This Course Helps",
  "howItHelpsTexts": ["text1", "text2", "text3"]
}
```

**extraFields:** Flexible category-specific data (optional)
```json
{
  "commonDilemmas": ["When to start?", "How to prepare?"],
  "programPhases": ["Phase 1: Foundation", "Phase 2: Practice"],
  "mentorshipFeatures": ["1-on-1 Guidance", "Weekly Reviews"]
}
```

### extraFields - Category-Specific Examples:

#### GS Foundation (No extraFields needed):
```json
// extraFields can be empty or omitted
{}
```

#### Mentorship:
```json
{
  "commonDilemmas": [
    "When to start answer writing practice?",
    "How to balance prelims and mains?",
    "Which optional subject to choose?"
  ],
  "programPhases": [
    "Phase 1: Foundation - Concept building",
    "Phase 2: Practice - Answer writing & tests",
    "Phase 3: Revision - Intensive mock tests"
  ],
  "mentorshipFeatures": [
    "1-on-1 mentorship from toppers",
    "Weekly progress reviews",
    "Personalized study plan",
    "24/7 doubt support"
  ]
}
```

#### Test Series:
```json
{
  "testStructure": [
    "25 sectional tests",
    "12 subject-wise tests",
    "8 full-length mock tests"
  ],
  "evaluationFeatures": [
    "Detailed performance analysis",
    "Model answers provided",
    "Mentor feedback on each test",
    "All-India ranking"
  ]
}
```

#### Optional Foundation:
```json
{
  "subjectsCovered": [
    "Anthropology",
    "Geography",
    "Sociology",
    "Public Administration"
  ],
  "courseFeatures": [
    "Daily answer writing practice",
    "Model answers for each topic",
    "Previous year question analysis",
    "Personal feedback on answers"
  ]
}
```

#### CSAT:
```json
{
  "topicsCovered": [
    "Quantitative Aptitude",
    "Logical Reasoning",
    "Reading Comprehension",
    "Data Interpretation"
  ],
  "practiceMaterials": [
    "500+ practice questions",
    "20 full-length tests",
    "Shortcut techniques"
  ]
}
```

### Brochure URL:
- Cloudinary stores PDF with proper `.pdf` extension using `format: 'pdf'` parameter
- Backend ensures correct format during upload
- Example: `https://res.cloudinary.com/.../raw/upload/.../courses/brochures/xyz.pdf`
- URL works correctly in browser and downloads properly

### Population:
- All GET and CREATE responses include populated `center` and `category` objects
- Returns full objects with `name` field, not just IDs

---

## Troubleshooting

### Error: "Required fields missing"
**Fix:** Ensure `title`, `center`, and `category` are provided

### Error: "Banner image is required"
**Fix:** Upload a banner image file

### Error: "Invalid PDF file"
**Fix:** Make sure you're uploading a valid PDF file

### Error: "Unknown API key"
**Fix:** Check your Cloudinary credentials in `.env` file

### Issue: howItHelps/keyHighlights/whyChoose returns empty
**Cause:** Not using JSON.stringify in form-data
**Fix:** 
```javascript
// ✅ CORRECT
formData.append('howItHelps', JSON.stringify({
  howItHelpsTitle: "Title",
  howItHelpsTexts: ["text1", "text2"]
}));

// ❌ WRONG - This won't work!
formData.append('howItHelpsTitle', 'Title');
formData.append('howItHelpsTexts', '["text1", "text2"]');
```

### Issue: Brochure URL returns 404 or shows bytecode
**Cause:** PDF not uploaded with correct format parameter
**Fix:** Backend now uses `format: 'pdf'` when uploading to Cloudinary
```javascript
// ✅ CORRECT - Backend code
const brochureResult = await uploadToCloudinary(
  files.brochure[0], 
  'courses/brochures', 
  'raw', 
  'pdf'  // Ensures .pdf extension
);

// This ensures:
// - File stored with .pdf extension
// - URL works correctly in browser
// - Downloads properly
// - No bytecode issues
```

**If you have existing broken uploads:**
1. Delete the old brochure from database
2. Re-upload the PDF (backend will handle format correctly)

### Issue: Center/Category returns only ID
**Cause:** API not populating references
**Fix:** Already fixed in backend - all endpoints now populate center and category
```json
// ✅ EXPECTED RESPONSE
{
  "center": {
    "_id": "...",
    "name": "Delhi"
  },
  "category": {
    "_id": "...",
    "name": "GS Foundation"
  }
}
```

### Debug Tips:
1. Check server console logs for parsing errors
2. Verify form-data payload in Postman/Network tab
3. Ensure JSON fields are properly stringified
4. Restart server after making code changes

---

## Quick Reference

### Required Fields:
- `title` (String)
- `center` (ObjectId)
- `category` (ObjectId)
- `banner` (File - JPEG, PNG, WebP, AVIF)

### Optional Fields:
- `description`, `duration`, `startDate` (Date OR String like "Admission open soon")
- `onlineFees`, `offlineFees`
- `modes`
- `highlight`, `section`, `gallery`, `video`, `brochure` (Files)
- `keyHighlights`, `whyChoose`, `howItHelps` (Content objects)
- `extraFields` (Category-specific flexible data - JSON object)

### API Endpoints:
- `POST /api/courses` - Create course (Protected)
- `GET /api/courses` - Get all courses (Public)
- `GET /api/courses/:id` - Get course by ID (Public)
- `GET /api/courses/slug/:slug` - Get course by slug (Public)
- `PUT /api/courses/:id` - Update course (Protected)
- `DELETE /api/courses/:id` - Delete course (Super Admin only)

---

**Happy Course Creating! 🎓**
