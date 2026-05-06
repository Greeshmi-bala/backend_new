# 📝 Blog System API Guide - Complete Code

## 📅 Implementation Date
**Created:** April 21, 2026

---

## 🚀 Overview

Complete blog system with Language, Paper, Blog, and BlogContent (Table of Contents) management.

### ✅ Key Features:
- **Language Management** - English, Telugu, Marathi, etc.
- **Paper Management** - GS I, GS II, GS III, etc.
- **Blog CRUD** - Create, Read, Update, Delete blogs with images
- **Table of Contents** - Section-wise content (Introduction, Background, etc.)
- **Filters** - Year, Month, Language, Paper
- **Cloudinary Integration** - Auto image uploads

---

## 📁 Database Design

### 1. Language Collection
```
Language
├── name: String (e.g., "English", "Telugu")
├── code: String (e.g., "en", "te")
├── isActive: Boolean
├── createdAt: Date
└── updatedAt: Date
```

### 2. Paper Collection
```
Paper
├── name: String (e.g., "GS I", "GS II")
├── isActive: Boolean
├── createdAt: Date
└── updatedAt: Date
```

### 3. Blog Collection
```
Blog
├── languageId: ObjectId → Language
├── paperId: ObjectId → Paper
├── title: String
├── description: String
├── thumbnail: { url, public_id }
├── images: [{ url, public_id }]
├── date: Date
├── year: Number
├── month: Number (1-12)
├── isActive: Boolean
├── createdAt: Date
└── updatedAt: Date
```

### 4. BlogContent Collection
```
BlogContent
├── blogId: ObjectId → Blog
├── title: String (e.g., "Introduction")
├── content: String (HTML/Text)
├── order: Number
├── createdAt: Date
└── updatedAt: Date
```

---

## 📦 Complete Backend Code

### 1. Models

#### Language Model (`models/Language.js`)
```javascript
const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Language', languageSchema);
```

#### Paper Model (`models/Paper.js`)
```javascript
const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Paper', paperSchema);
```

#### Blog Model (`models/Blog.js`)
```javascript
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  languageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language',
    required: true
  },
  paperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paper',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  thumbnail: {
    url: String,
    public_id: String
  },
  images: [{
    url: String,
    public_id: String
  }],
  date: {
    type: Date
  },
  year: {
    type: Number
  },
  month: {
    type: Number,
    min: 1,
    max: 12
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

blogSchema.index({ languageId: 1, paperId: 1 });
blogSchema.index({ year: 1, month: 1 });
blogSchema.index({ isActive: 1 });

module.exports = mongoose.model('Blog', blogSchema);
```

#### BlogContent Model (`models/BlogContent.js`)
```javascript
const mongoose = require('mongoose');

const blogContentSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  }
}, { timestamps: true });

blogContentSchema.index({ blogId: 1, order: 1 });

module.exports = mongoose.model('BlogContent', blogContentSchema);
```

---

### 2. Routes

#### Blog Routes (`routes/blogRoutes.js`)
```javascript
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogFilters
} = require('../controllers/blogController');

const {
  createLanguage,
  getLanguages,
  updateLanguage,
  deleteLanguage
} = require('../controllers/languageController');

const {
  createPaper,
  getPapers,
  updatePaper,
  deletePaper
} = require('../controllers/paperController');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// ==============================
// LANGUAGE ROUTES
// ==============================
router.route('/languages')
  .get(getLanguages)
  .post(protect, authorize('super_admin'), createLanguage);

router.route('/languages/:id')
  .put(protect, authorize('super_admin'), updateLanguage)
  .delete(protect, authorize('super_admin'), deleteLanguage);

// ==============================
// PAPER ROUTES
// ==============================
router.route('/papers')
  .get(getPapers)
  .post(protect, authorize('super_admin'), createPaper);

router.route('/papers/:id')
  .put(protect, authorize('super_admin'), updatePaper)
  .delete(protect, authorize('super_admin'), deletePaper);

// ==============================
// BLOG ROUTES
// ==============================

// Public routes
router.get('/blogs', getBlogs);
router.get('/blogs/filters', getBlogFilters);
router.get('/blogs/:id', getBlogById);

// Protected routes (Admin only)
router.post(
  '/blogs',
  protect,
  authorize('super_admin'),
  upload.fields([
    { name: 'thumbnail' },
    { name: 'images', maxCount: 20 }
  ]),
  createBlog
);

router.put(
  '/blogs/:id',
  protect,
  authorize('super_admin'),
  upload.fields([
    { name: 'thumbnail' },
    { name: 'images', maxCount: 20 }
  ]),
  updateBlog
);

router.delete(
  '/blogs/:id',
  protect,
  authorize('super_admin'),
  deleteBlog
);

module.exports = router;
```

---

## 🔌 API Endpoints

### Base URL
```
{{BASE_URL}} = http://localhost:5000/api
```

---

## 1️⃣ LANGUAGE APIs

### Create Language
**POST** `/api/languages`

**Access:** Super Admin  
**Content-Type:** `application/json`

**Body:**
```json
{
  "name": "English",
  "code": "en",
  "isActive": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Language created successfully",
  "data": {
    "_id": "...",
    "name": "English",
    "code": "en",
    "isActive": true
  }
}
```

---

### Get All Languages
**GET** `/api/languages`

**Access:** Public

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    { "_id": "...", "name": "English", "code": "en", "isActive": true },
    { "_id": "...", "name": "Telugu", "code": "te", "isActive": true },
    { "_id": "...", "name": "Marathi", "code": "mr", "isActive": true }
  ]
}
```

---

### Update Language
**PUT** `/api/languages/:id`

**Body:**
```json
{
  "name": "English (Updated)",
  "isActive": false
}
```

---

### Delete Language
**DELETE** `/api/languages/:id`

---

## 2️⃣ PAPER APIs

### Create Paper
**POST** `/api/papers`

**Access:** Super Admin  
**Content-Type:** `application/json`

**Body:**
```json
{
  "name": "GS I",
  "isActive": true
}
```

---

### Get All Papers
**GET** `/api/papers`

**Access:** Public

**Response (200):**
```json
{
  "success": true,
  "count": 4,
  "data": [
    { "_id": "...", "name": "GS I", "isActive": true },
    { "_id": "...", "name": "GS II", "isActive": true },
    { "_id": "...", "name": "GS III", "isActive": true },
    { "_id": "...", "name": "GS IV", "isActive": true }
  ]
}
```

---

### Update Paper
**PUT** `/api/papers/:id`

---

### Delete Paper
**DELETE** `/api/papers/:id`

---

## 3️⃣ BLOG APIs

### Create Blog
**POST** `/api/blogs`

**Access:** Super Admin  
**Content-Type:** `multipart/form-data`

**FormData Fields:**
| Key | Value | Type |
|-----|-------|------|
| `languageId` | Language ObjectId | Text |
| `paperId` | Paper ObjectId | Text |
| `title` | Blog title | Text |
| `description` | Blog description | Text |
| `date` | 2026-04-21 (optional) | Text |
| `tableContent` | JSON array of sections | Text |
| `thumbnail` | [Select File] | File |
| `images` | [Select Files] (multiple) | File |

**tableContent Format:**
```json
[
  {
    "title": "Introduction",
    "content": "<p>This is the introduction...</p>",
    "order": 1
  },
  {
    "title": "Background",
    "content": "<p>Background information...</p>",
    "order": 2
  },
  {
    "title": "Conclusion",
    "content": "<p>Conclusion text...</p>",
    "order": 3
  }
]
```

**Postman Example:**
```
languageId = 69e8...                         [Text]
paperId = 69e8...                            [Text]
title = India's Foreign Policy 2026          [Text]
description = Analysis of foreign policy     [Text]
date = 2026-04-21                            [Text]
tableContent = [{"title":"Introduction","content":"<p>Intro text</p>","order":1}]  [Text]
thumbnail = [Select File: thumb.jpg]         [File]
images = [Select File: img1.jpg]             [File]
images = [Select File: img2.jpg]             [File]
```

**Response (201):**
```json
{
  "success": true,
  "message": "Blog created successfully",
  "data": {
    "_id": "...",
    "languageId": { "name": "English", "code": "en" },
    "paperId": { "name": "GS I" },
    "title": "India's Foreign Policy 2026",
    "description": "Analysis of foreign policy",
    "thumbnail": {
      "url": "https://res.cloudinary.com/...",
      "public_id": "blogs/thumb123"
    },
    "images": [
      { "url": "https://res.cloudinary.com/...", "public_id": "blogs/img1" }
    ],
    "date": "2026-04-21T00:00:00.000Z",
    "year": 2026,
    "month": 4,
    "isActive": true
  }
}
```

---

### Get All Blogs (with filters)
**GET** `/api/blogs`

**Access:** Public

**Query Parameters:**
```
?languageId=xxx&paperId=xxx&year=2026&month=4&limit=4
```

**Example 1: Get latest 4 blogs for English**
```
GET /api/blogs?languageId=69e8...&limit=4
```

**Example 2: Get GS I blogs for April 2026**
```
GET /api/blogs?paperId=69e8...&year=2026&month=4
```

**Example 3: Get all blogs**
```
GET /api/blogs
```

**Response (200):**
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "_id": "...",
      "languageId": { "name": "English", "code": "en" },
      "paperId": { "name": "GS I" },
      "title": "India's Foreign Policy 2026",
      "thumbnail": { "url": "..." },
      "year": 2026,
      "month": 4
    }
  ]
}
```

---

### Get Single Blog (with content sections)
**GET** `/api/blogs/:id`

**Access:** Public

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "languageId": { "name": "English", "code": "en" },
    "paperId": { "name": "GS I" },
    "title": "India's Foreign Policy 2026",
    "description": "Analysis of foreign policy",
    "thumbnail": { "url": "..." },
    "images": [...],
    "year": 2026,
    "month": 4,
    "contents": [
      {
        "_id": "...",
        "title": "Introduction",
        "content": "<p>This is the introduction...</p>",
        "order": 1
      },
      {
        "_id": "...",
        "title": "Background",
        "content": "<p>Background information...</p>",
        "order": 2
      },
      {
        "_id": "...",
        "title": "Conclusion",
        "content": "<p>Conclusion text...</p>",
        "order": 3
      }
    ]
  }
}
```

---

### Update Blog
**PUT** `/api/blogs/:id`

**Access:** Super Admin  
**Content-Type:** `multipart/form-data`

**FormData Fields (same as create, all optional):**
```
languageId = 69e8... (optional)
paperId = 69e8... (optional)
title = Updated Title (optional)
description = Updated description (optional)
tableContent = [...] (optional - replaces all sections)
thumbnail = [New File] (optional - replaces old)
images = [New Files] (optional - replaces all old images)
```

**Note:** Only send fields you want to update.

---

### Delete Blog
**DELETE** `/api/blogs/:id`

**Access:** Super Admin

**Response (200):**
```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

---

### Get Blogs Filtered by Language (Lightweight)
**GET** `/api/blogs/filters/language?languageId=LANG_ID`

**Access:** Public

**Description:** Returns a lightweight list of blogs filtered by language. Only returns essential fields for listing/grid views.

**Query Parameters:**
```
?languageId=69e8...
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "blog_id_here",
      "thumbnail": "https://res.cloudinary.com/...jpg",
      "title": "Blog Title Here",
      "date": "2024-01-15T00:00:00.000Z"
    },
    {
      "_id": "blog_id_here_2",
      "thumbnail": "https://res.cloudinary.com/...jpg",
      "title": "Another Blog Title",
      "date": "2024-01-10T00:00:00.000Z"
    }
  ]
}
```

**Note:** This endpoint only returns `thumbnail`, `title`, and `date` for optimized performance. Use `GET /api/blogs/:id` to get full blog details with content sections.

---

### Get Blogs Filtered by Paper (Lightweight)
**GET** `/api/blogs/filters/paper?paperId=PAPER_ID`

**Access:** Public

**Description:** Returns a lightweight list of blogs filtered by paper. Only returns essential fields for listing/grid views.

**Query Parameters:**
```
?paperId=69e8...
```

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "blog_id_here",
      "thumbnail": "https://res.cloudinary.com/...jpg",
      "title": "GS I Blog Title",
      "date": "2024-02-20T00:00:00.000Z"
    }
  ]
}
```

**Note:** This endpoint only returns `thumbnail`, `title`, and `date` for optimized performance. Use `GET /api/blogs/:id` to get full blog details with content sections.

---

## 🧪 Testing Workflow

### Step 1: Create Languages
```
POST /api/languages
{ "name": "English", "code": "en" }

POST /api/languages
{ "name": "Telugu", "code": "te" }
```

### Step 2: Create Papers
```
POST /api/papers
{ "name": "GS I" }

POST /api/papers
{ "name": "GS II" }
```

### Step 3: Create Blog
```
POST /api/blogs (FormData)
languageId = [English ID]
paperId = [GS I ID]
title = India's Foreign Policy 2026
tableContent = [{"title":"Introduction","content":"<p>Intro</p>","order":1}]
thumbnail = [file]
images = [files]
```

### Step 4: Get Blogs
```
GET /api/blogs?languageId=[English ID]&limit=4
```

### Step 5: Get Single Blog
```
GET /api/blogs/[BLOG_ID]
```

### Step 6: Get Blogs by Language Filter
```
GET /api/blogs/filters/language?languageId=[English ID]
```
**Returns:** Lightweight list (thumbnail, title, date)

### Step 7: Get Blogs by Paper Filter
```
GET /api/blogs/filters/paper?paperId=[GS I ID]
```
**Returns:** Lightweight list (thumbnail, title, date)

---

## 💻 Frontend Integration

### React Example: Get Blogs

```jsx
import { useState, useEffect } from 'react';

function BlogList({ languageId, paperId, year, month }) {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, [languageId, paperId, year, month]);

  const fetchBlogs = async () => {
    const params = new URLSearchParams();
    if (languageId) params.append('languageId', languageId);
    if (paperId) params.append('paperId', paperId);
    if (year) params.append('year', year);
    if (month) params.append('month', month);
    params.append('limit', '4');

    const response = await fetch(`/api/blogs?${params}`);
    const result = await response.json();
    setBlogs(result.data);
  };

  return (
    <div>
      {blogs.map(blog => (
        <div key={blog._id}>
          <img src={blog.thumbnail?.url} alt={blog.title} />
          <h3>{blog.title}</h3>
          <p>{blog.paperId?.name}</p>
        </div>
      ))}
    </div>
  );
}
```

---

### Create Blog Form

```jsx
function CreateBlogForm() {
  const [formData, setFormData] = useState({
    languageId: '',
    paperId: '',
    title: '',
    description: '',
    date: '',
    tableContent: []
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);

  const addSection = () => {
    setFormData({
      ...formData,
      tableContent: [
        ...formData.tableContent,
        { title: '', content: '', order: formData.tableContent.length + 1 }
      ]
    });
  };

  const updateSection = (index, field, value) => {
    const updated = [...formData.tableContent];
    updated[index][field] = value;
    setFormData({ ...formData, tableContent: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('languageId', formData.languageId);
    data.append('paperId', formData.paperId);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('date', formData.date);
    data.append('tableContent', JSON.stringify(formData.tableContent));
    data.append('thumbnail', thumbnail);
    images.forEach(img => data.append('images', img));

    const response = await fetch('/api/blogs', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: data
    });

    const result = await response.json();
    alert('Blog created!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={formData.languageId} onChange={e => setFormData({...formData, languageId: e.target.value})}>
        <option value="">Select Language</option>
        {/* Map languages */}
      </select>

      <select value={formData.paperId} onChange={e => setFormData({...formData, paperId: e.target.value})}>
        <option value="">Select Paper</option>
        {/* Map papers */}
      </select>

      <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
      
      <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
      
      <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
      
      <input type="file" onChange={e => setThumbnail(e.target.files[0])} />
      
      <input type="file" multiple onChange={e => setImages(Array.from(e.target.files))} />

      {/* Table Content Sections */}
      {formData.tableContent.map((section, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Section Title"
            value={section.title}
            onChange={e => updateSection(index, 'title', e.target.value)}
          />
          <textarea
            placeholder="Section Content (HTML)"
            value={section.content}
            onChange={e => updateSection(index, 'content', e.target.value)}
          />
        </div>
      ))}

      <button type="button" onClick={addSection}>Add Section</button>
      <button type="submit">Create Blog</button>
    </form>
  );
}
```

---

## 🔐 Role-Based Access Control

| Feature | Super Admin | Public |
|---------|-------------|--------|
| Create Language | ✅ | ❌ |
| View Languages | ✅ | ✅ |
| Create Paper | ✅ | ❌ |
| View Papers | ✅ | ✅ |
| Create Blog | ✅ | ❌ |
| View Blogs | ✅ | ✅ |
| Update Blog | ✅ | ❌ |
| Delete Blog | ✅ | ❌ |

---

## 📝 Important Notes

### ✅ Auto-Extracted Fields:
- **Year & Month** → Automatically extracted from `date` field
- **Slug** → Auto-generated from title for SEO-friendly URLs
- **Views** → Starts at 0, can be incremented on each view

### ✅ Validations:
- **Language** → Must exist and be active
- **Paper** → Must exist and be active
- **Title** → Required
- **tableContent** → Must be valid JSON array

### ✅ Default Behaviors:
- **Sort Order** → Always by `createdAt: -1` (latest first)
- **Limit** → Default 10 if not specified
- **Date** → Uses current date if not provided

### ✅ DO:
- Create languages and papers first before creating blogs
- Use valid JSON for `tableContent`
- Upload thumbnail (optional but recommended)
- Use HTML for content sections
- Set proper order numbers for sections
- Always provide `date` field (year/month auto-extracted)

### ❌ DON'T:
- Don't skip languageId or paperId (required)
- Don't send invalid JSON in tableContent
- Don't upload files > 5MB
- Don't forget to populate languages/papers before creating blogs
- Don't manually set year/month (auto-extracted from date)

---

## 🔧 All Fixes Applied

### ✅ Fix 1: Default Sort Order
```javascript
.sort({ createdAt: -1 }) // ALWAYS returns latest first
```

### ✅ Fix 2: Auto Year/Month Extraction
```javascript
const blogDate = date ? new Date(date) : new Date();
const blogYear = blogDate.getFullYear(); // Auto-extracted
const blogMonth = blogDate.getMonth() + 1; // Auto-extracted
```

### ✅ Fix 3: Table Content Replace (Update)
```javascript
// Delete old contents first
await BlogContent.deleteMany({ blogId: blog._id });
// Insert new contents
await BlogContent.insertMany(contentData);
```

### ✅ Fix 4: Language/Paper Validation
```javascript
const language = await Language.findById(languageId);
if (!language || !language.isActive) {
  throw Error('Invalid or inactive language');
}

const paper = await Paper.findById(paperId);
if (!paper || !paper.isActive) {
  throw Error('Invalid or inactive paper');
}
```

### ✅ Fix 5: Filter API with Language
```javascript
GET /api/blogs/filters?languageId=xxx
// Returns filters specific to that language
```

### ✅ Fix 6: Default Limit
```javascript
const blogLimit = parseInt(limit) || 10; // Default 10
```

### ✅ Bonus 1: Slug (SEO)
```javascript
slug: "indias-foreign-policy-2026-1714089600000"
// Auto-generated from title
```

### ✅ Bonus 2: Views Counter
```javascript
views: { type: Number, default: 0 }
// Increment on each blog view
```

### ✅ Bonus 3: Lightweight Filter Endpoints (Performance Optimized)
```javascript
// Language Filter - Only returns thumbnail, title, date
GET /api/blogs/filters/language?languageId=xxx

// Paper Filter - Only returns thumbnail, title, date  
GET /api/blogs/filters/paper?paperId=xxx

// Uses .select() to fetch only required fields
// No populate, no content sections
// Perfect for listing/grid views
```

---

## 🚀 Quick Reference

| Action | Method | Endpoint | Access |
|--------|--------|----------|--------|
| Create Language | POST | `/api/languages` | Super Admin |
| Get Languages | GET | `/api/languages` | Public |
| Create Paper | POST | `/api/papers` | Super Admin |
| Get Papers | GET | `/api/papers` | Public |
| Create Blog | POST | `/api/blogs` | Super Admin |
| Get Blogs | GET | `/api/blogs` | Public |
| Get Blog Detail | GET | `/api/blogs/:id` | Public |
| Update Blog | PUT | `/api/blogs/:id` | Super Admin |
| Delete Blog | DELETE | `/api/blogs/:id` | Super Admin |
| Get Blogs by Language | GET | `/api/blogs/filters/language?languageId=xxx` | Public |
| Get Blogs by Paper | GET | `/api/blogs/filters/paper?paperId=xxx` | Public |

---

## 🎯 Summary

- **Languages** → Filter blogs by language (English, Telugu, etc.)
- **Papers** → Filter blogs by paper (GS I, GS II, etc.)
- **Blogs** → Main content with thumbnail and images
- **BlogContent** → Section-wise table of contents
- **Filters** → Year and month filtering
- **Language Filter API** → Lightweight endpoint (thumbnail, title, date)
- **Paper Filter API** → Lightweight endpoint (thumbnail, title, date)
- **Cloudinary** → Auto image uploads
- **Performance** → Optimized filter endpoints with field projection

**Ready to use!** 🚀
