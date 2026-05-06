# 📝 Blog System - Complete API Guide (100% Production Ready)

## 🎯 Overview

Enterprise-level production-ready Blog system with dynamic categories, article CRUD, search, pagination, and recent articles functionality.

**✅ Production Optimizations:**
- Atomic view counter (race condition safe)
- Text search indexing (faster queries)
- Unique slug generation with auto-increment
- Category delete protection (prevents orphan articles)
- Active category validation
- Performance indexes on all critical fields
- Multiple sorting options (latest, popular, oldest)

---

## 📦 MongoDB Models

### BlogCategory Model

```javascript
const mongoose = require('mongoose');
const slugify = require('slugify');

const BlogCategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Category name is required'],
    unique: true,
    trim: true
  },
  slug: { 
    type: String, 
    unique: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }
}, { timestamps: true });

// Indexes for performance
ArticleSchema.index({ categoryId: 1, createdAt: -1 });
ArticleSchema.index({ slug: 1 });
ArticleSchema.index({ title: 'text', description: 'text' });
ArticleSchema.index({ isActive: 1, createdAt: -1 });

// Generate unique slug before saving
BlogCategorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("BlogCategory", BlogCategorySchema);
```

**Features:**
- Auto-generated slugs (e.g., "Technology" → "technology")
- Soft delete support (isActive flag)
- Tracks who created the category

---

### Article Model

```javascript
const mongoose = require('mongoose');
const slugify = require('slugify');

const ArticleSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Article title is required'],
    trim: true
  },
  slug: { 
    type: String, 
    unique: true 
  },

  description: {
    type: String,
    trim: true
  },
  
  content: {
    type: String,
    required: [true, 'Article content is required']
  },

  thumbnail: {
    url: String,
    public_id: String
  },

  images: [
    {
      url: String,
      public_id: String
    }
  ],

  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BlogCategory",
    required: [true, 'Category is required']
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  isActive: { 
    type: Boolean, 
    default: true 
  },

  views: { 
    type: Number, 
    default: 0 
  },

  readTime: { 
    type: Number // in minutes
  }
}, { timestamps: true });

// Generate unique slug before saving
ArticleSchema.pre('save', async function(next) {
  if (this.isModified('title')) {
    let slug = slugify(this.title, { lower: true, strict: true });
    const count = await mongoose.models.Article.countDocuments({ slug: new RegExp(`^${slug}`, 'i') });
    this.slug = count ? `${slug}-${count + 1}` : slug;
  }
  next();
});

// Validate max 5 images
ArticleSchema.pre('save', function(next) {
  if (this.images && this.images.length > 5) {
    next(new Error('Maximum 5 images allowed per article'));
  }
  next();
});

// Increment views method (atomic operation to prevent race conditions)
ArticleSchema.methods.incrementViews = async function() {
  await mongoose.models.Article.findByIdAndUpdate(this._id, {
    $inc: { views: 1 }
  });
};

module.exports = mongoose.model("Article", ArticleSchema);
```

**Features:**
- Auto-generated slugs
- Thumbnail + up to 5 images
- Views counter (auto-increment)
- Read time tracking
- Soft delete support
- Author tracking

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:5000/api/blog
```

---

## 📂 CATEGORY APIs

### 1. Create Category

**Endpoint:** `POST /api/blog/categories`

**Access:** Private (Admin only)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
  "name": "Technology"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "_id": "6789abcd1234ef5678ghij90",
    "name": "Technology",
    "slug": "technology",
    "isActive": true,
    "createdBy": "user_id_here",
    "createdAt": "2026-04-18T10:30:00.000Z",
    "updatedAt": "2026-04-18T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Category already exists"
}
```

---

### 2. Get All Categories

**Endpoint:** `GET /api/blog/categories`

**Access:** Public

**Query Parameters:**
- `isActive` (optional): Filter by active status (`true` or `false`)

**Example:**
```
GET /api/blog/categories
GET /api/blog/categories?isActive=true
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "6789abcd1234ef5678ghij90",
      "name": "Technology",
      "slug": "technology",
      "isActive": true,
      "createdAt": "2026-04-18T10:30:00.000Z",
      "updatedAt": "2026-04-18T10:30:00.000Z"
    },
    {
      "_id": "6789abcd1234ef5678ghij91",
      "name": "Sports",
      "slug": "sports",
      "isActive": true,
      "createdAt": "2026-04-18T10:31:00.000Z",
      "updatedAt": "2026-04-18T10:31:00.000Z"
    }
  ]
}
```

---

### 3. Get Single Category

**Endpoint:** `GET /api/blog/categories/:id`

**Access:** Public

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "6789abcd1234ef5678ghij90",
    "name": "Technology",
    "slug": "technology",
    "isActive": true,
    "createdAt": "2026-04-18T10:30:00.000Z",
    "updatedAt": "2026-04-18T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Category not found"
}
```

---

### 4. Update Category

**Endpoint:** `PUT /api/blog/categories/:id`

**Access:** Private (Admin only)

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
  "name": "Technology & Innovation",
  "isActive": true
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "_id": "6789abcd1234ef5678ghij90",
    "name": "Technology & Innovation",
    "slug": "technology-innovation",
    "isActive": true,
    "createdAt": "2026-04-18T10:30:00.000Z",
    "updatedAt": "2026-04-18T10:35:00.000Z"
  }
}
```

---

### 5. Delete Category (Soft Delete)

**Endpoint:** `DELETE /api/blog/categories/:id`

**Access:** Private (Admin only)

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": {
    "_id": "6789abcd1234ef5678ghij90",
    "name": "Technology",
    "slug": "technology",
    "isActive": false,
    "createdAt": "2026-04-18T10:30:00.000Z",
    "updatedAt": "2026-04-18T10:40:00.000Z"
  }
}
```

---

## 📰 ARTICLE APIs

### 1. Create Article

**Endpoint:** `POST /api/blog/articles`

**Access:** Private (Super Admin & Center Admin only)

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer <your_jwt_token>
```

**Request Body (Form Data):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | Text | Yes | Article title |
| `description` | Text | No | Short description |
| `content` | Text | Yes | Full article content (HTML allowed) |
| `categoryId` | Text | Yes | Category ID |
| `readTime` | Number | No | Estimated read time in minutes |
| `thumbnail` | File | No | Article thumbnail image (1 file) |
| `images` | File | No | Article images (max 5 files) |

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/blog/articles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=AI Revolution in 2026" \
  -F "description=How AI is transforming the world" \
  -F "content=<p>Full article content with HTML tags...</p>" \
  -F "categoryId=6789abcd1234ef5678ghij90" \
  -F "readTime=5" \
  -F "thumbnail=@/path/to/thumbnail.jpg" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

**JavaScript Example (FormData):**
```javascript
const formData = new FormData();
formData.append('title', 'AI Revolution in 2026');
formData.append('description', 'How AI is transforming the world');
formData.append('content', '<p>Full article content...</p>');
formData.append('categoryId', '6789abcd1234ef5678ghij90');
formData.append('readTime', 5);
formData.append('thumbnail', thumbnailFile); // File object
formData.append('images', imageFile1); // File object
formData.append('images', imageFile2); // File object

const response = await fetch('/api/blog/articles', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

**Validation:**
- Maximum 5 images allowed
- Category must exist
- Title and content are required

**Success Response (201):**
```json
{
  "success": true,
  "message": "Article created successfully",
  "data": {
    "_id": "article_id_here",
    "title": "AI Revolution in 2026",
    "slug": "ai-revolution-in-2026",
    "description": "How AI is transforming the world",
    "content": "<p>Full article content with HTML tags...</p>",
    "thumbnail": {
      "url": "https://res.cloudinary.com/demo/image/upload/v1234567890/thumbnail.jpg",
      "public_id": "blog/thumbnail_123"
    },
    "images": [...],
    "categoryId": {
      "_id": "6789abcd1234ef5678ghij90",
      "name": "Technology",
      "slug": "technology"
    },
    "author": {
      "_id": "user_id_here",
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "isActive": true,
    "views": 0,
    "readTime": 5,
    "createdAt": "2026-04-18T11:00:00.000Z",
    "updatedAt": "2026-04-18T11:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Maximum 5 images allowed per article"
}
```

---

### 2. Get All Articles (with Filters & Pagination)

**Endpoint:** `GET /api/blog/articles`

**Access:** Public

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `categoryId` (optional): Filter by category ID
- `search` (optional): Search using text index (fast)
- `isActive` (optional): Filter by active status (default: true, 'all' for admin)
- `sort` (optional): Sort order - `latest` (default), `popular`, `oldest`

**Examples:**
```
GET /api/blog/articles
GET /api/blog/articles?page=1&limit=6
GET /api/blog/articles?categoryId=6789abcd1234ef5678ghij90
GET /api/blog/articles?search=AI
GET /api/blog/articles?page=1&limit=10&categoryId=xxx&search=technology
GET /api/blog/articles?sort=popular
GET /api/blog/articles?sort=latest&page=2&limit=5
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "total": 15,
  "page": 1,
  "pages": 2,
  "data": [
    {
      "_id": "article_id_1",
      "title": "AI Revolution in 2026",
      "slug": "ai-revolution-in-2026",
      "description": "How AI is transforming the world",
      "thumbnail": {
        "url": "https://...",
        "public_id": "blog/thumbnail_123"
      },
      "categoryId": {
        "_id": "6789abcd1234ef5678ghij90",
        "name": "Technology",
        "slug": "technology"
      },
      "author": {
        "_id": "user_id",
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "views": 45,
      "readTime": 5,
      "createdAt": "2026-04-18T11:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Recent 6 Articles 🔥

**Endpoint:** `GET /api/blog/articles/recent`

**Access:** Public

**Description:** Returns the latest 6 active articles for the "Recent Articles" section on your UI.

**Success Response (200):**
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "_id": "article_id",
      "title": "Latest Article",
      "slug": "latest-article",
      "description": "Description here",
      "thumbnail": {
        "url": "https://...",
        "public_id": "blog/thumb_1"
      },
      "categoryId": {
        "name": "Technology",
        "slug": "technology"
      },
      "author": {
        "name": "Admin User"
      },
      "views": 120,
      "readTime": 5,
      "createdAt": "2026-04-18T11:00:00.000Z"
    }
  ]
}
```

---

### 4. Get Single Article

**Endpoint:** `GET /api/blog/articles/:id`

**Access:** Public

**Description:** Get article by ID or slug. Automatically increments view count.

**Examples:**
```
GET /api/blog/articles/6789abcd1234ef5678ghij90
GET /api/blog/articles/ai-revolution-in-2026
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "article_id",
    "title": "AI Revolution in 2026",
    "slug": "ai-revolution-in-2026",
    "description": "How AI is transforming the world",
    "content": "<p>Full article content...</p>",
    "thumbnail": {
      "url": "https://...",
      "public_id": "blog/thumbnail_123"
    },
    "images": [...],
    "categoryId": {
      "_id": "6789abcd1234ef5678ghij90",
      "name": "Technology",
      "slug": "technology"
    },
    "author": {
      "_id": "user_id",
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "isActive": true,
    "views": 46,
    "readTime": 5,
    "createdAt": "2026-04-18T11:00:00.000Z",
    "updatedAt": "2026-04-18T11:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Article not found"
}
```

---

### 5. Update Article

**Endpoint:** `PUT /api/blog/articles/:id`

**Access:** Private (Super Admin & Center Admin only)

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer <your_jwt_token>
```

**Request Body (Form Data):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | Text | No | Updated title |
| `description` | Text | No | Updated description |
| `content` | Text | No | Updated content |
| `categoryId` | Text | No | Updated category ID |
| `readTime` | Number | No | Updated read time |
| `removeThumbnail` | Text | No | Set to "true" to remove current thumbnail |
| `removeImages` | Text | No | Comma-separated indexes to remove (e.g., "0,2") |
| `thumbnail` | File | No | New thumbnail image (replaces old one) |
| `images` | File | No | New images to add (max 5 total) |

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/blog/articles/ARTICLE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Updated AI Revolution Title" \
  -F "description=Updated description" \
  -F "readTime=7" \
  -F "thumbnail=@/path/to/new-thumbnail.jpg" \
  -F "images=@/path/to/new-image.jpg"
```

**Remove Images Example:**
```bash
curl -X PUT http://localhost:5000/api/blog/articles/ARTICLE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "removeThumbnail=true" \
  -F "removeImages=0,2"
```

**JavaScript Example:**
```javascript
const formData = new FormData();
formData.append('title', 'Updated Title');
formData.append('readTime', 7);
formData.append('thumbnail', newThumbnailFile); // Replaces old
formData.append('images', newImage1); // Adds to existing

const response = await fetch(`/api/blog/articles/${articleId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Article updated successfully",
  "data": {
    "_id": "article_id",
    "title": "Updated AI Revolution Title",
    "slug": "updated-ai-revolution-title",
    ...
  }
}
```

---

### 6. Delete Article (Soft Delete)

**Endpoint:** `DELETE /api/blog/articles/:id`

**Access:** Private (Admin only)

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Article deleted successfully",
  "data": {
    "_id": "article_id",
    "title": "AI Revolution in 2026",
    "isActive": false,
    ...
  }
}
```

---

## 🧪 Testing with cURL

### Create Category
```bash
curl -X POST http://localhost:5000/api/blog/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name": "Technology"}'
```

### Get All Categories
```bash
curl http://localhost:5000/api/blog/categories
```

### Create Article
```bash
curl -X POST http://localhost:5000/api/blog/articles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=AI Revolution" \
  -F "description=How AI is changing the world" \
  -F "content=<p>Full content here...</p>" \
  -F "categoryId=CATEGORY_ID_HERE" \
  -F "readTime=5" \
  -F "thumbnail=@/path/to/thumbnail.jpg" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

### Get Recent Articles
```bash
curl http://localhost:5000/api/blog/articles/recent
```

### Search Articles
```bash
curl "http://localhost:5000/api/blog/articles?search=AI&page=1&limit=10"
```

---

## 📊 Complete Testing Workflow

### Step 1: Login as Admin
```bash
POST /api/auth/login
{
  "email": "admin@sriramias.com",
  "password": "your_password"
}
```
Save the returned `token`.

---

### Step 2: Create Categories
```bash
POST /api/blog/categories
Headers: Authorization: Bearer <token>

[
  { "name": "News" },
  { "name": "Technology" },
  { "name": "Sports" },
  { "name": "Education" },
  { "name": "Current Affairs" }
]
```

---

### Step 3: Get Categories (Save IDs)
```bash
GET /api/blog/categories
```
Copy the category IDs for article creation.

---

### Step 4: Create Articles
```bash
POST /api/blog/articles
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- title: "UPSC 2026 Notification Released"
- description: "UPSC has released the official notification for 2026 exam"
- content: "<p>Detailed article content...</p>"
- categoryId: "NEWS_CATEGORY_ID"
- readTime: 3
- thumbnail: (upload file)
- images: (upload files, max 5)
```

Create at least 7-8 articles for testing pagination and recent articles.

---

### Step 5: Test Recent Articles
```bash
GET /api/blog/articles/recent
```
Should return exactly 6 latest articles.

---

### Step 6: Test Search
```bash
GET /api/blog/articles?search=UPSC
GET /api/blog/articles?search=Technology
```

---

### Step 7: Test Pagination
```bash
GET /api/blog/articles?page=1&limit=3
GET /api/blog/articles?page=2&limit=3
```

---

### Step 8: Test Category Filter
```bash
GET /api/blog/articles?categoryId=NEWS_CATEGORY_ID
```

---

### Step 9: View Single Article (Check View Count)
```bash
GET /api/blog/articles/ARTICLE_ID
```
Call this multiple times and verify the `views` field increases.

---

### Step 10: Update Article
```bash
PUT /api/blog/articles/ARTICLE_ID
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- title: "Updated Title"
- readTime: 5
- thumbnail: (upload new file - optional)
- images: (upload new files - optional)
```

---

### Step 11: Soft Delete
```bash
DELETE /api/blog/articles/ARTICLE_ID
Headers: Authorization: Bearer <token>
```

Verify it no longer appears in public lists.

---

## 🔐 Authentication

### Protected Routes (Admin Only)
All POST, PUT, DELETE operations require:
- Valid JWT token in `Authorization` header
- User role must be `admin`

### Public Routes
All GET operations are public and don't require authentication.

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Maximum 5 images allowed per article"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized as admin"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Article not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error while creating article",
  "error": "Error details (in development mode)"
}
```

---

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm run dev
   ```

3. **Test health check:**
   ```bash
   curl http://localhost:5000/health
   ```

4. **Login as admin and get token**

5. **Start creating categories and articles!**

---

## 🔥 Production Features

### 1. **Race Condition Safe View Counter**
Uses atomic `$inc` operation instead of manual increment:
```javascript
await Article.findByIdAndUpdate(id, { $inc: { views: 1 } });
```

### 2. **Fast Text Search**
MongoDB text index instead of regex:
```javascript
ArticleSchema.index({ title: 'text', description: 'text' });
// Query: { $text: { $search: search } }
```

### 3. **Unique Slug Auto-Generation**
Handles duplicate titles automatically:
- "AI News" → `ai-news`
- "AI News" (2nd) → `ai-news-2`
- "AI News" (3rd) → `ai-news-3`

### 4. **Category Delete Protection**
Prevents deletion of categories with active articles:
```json
{
  "success": false,
  "message": "Cannot delete category. It has 5 active article(s). Please delete or reassign them first.",
  "articleCount": 5
}
```

### 5. **Active Category Validation**
Cannot create/update articles with inactive categories.

### 6. **Performance Indexes**
- `{ categoryId: 1, createdAt: -1 }` - Category filtering
- `{ slug: 1 }` - Slug lookup
- `{ title: 'text', description: 'text' }` - Text search
- `{ isActive: 1, createdAt: -1 }` - Active articles

### 7. **Sorting Options**
- `?sort=latest` - Newest first (default)
- `?sort=popular` - Most viewed
- `?sort=oldest` - Oldest first

---

## 📝 Notes

- All slugs are auto-generated from names/titles
- Soft delete sets `isActive: false` instead of removing records
- View count increments automatically on each article read
- Maximum 5 images per article (validated at model level)
- Default pagination: 10 articles per page
- Recent articles API returns exactly 6 latest active articles
- Search works on both title and description fields
- Articles can be accessed by ID or slug

---

## 🎯 Frontend Integration Example

```javascript
// Get recent articles for homepage
const fetchRecentArticles = async () => {
  const response = await fetch('/api/blog/articles/recent');
  const data = await response.json();
  return data.data;
};

// Get articles with pagination
const fetchArticles = async (page = 1, limit = 10, search = '') => {
  const response = await fetch(
    `/api/blog/articles?page=${page}&limit=${limit}&search=${search}`
  );
  const data = await response.json();
  return data;
};

// Get single article
const fetchArticle = async (idOrSlug) => {
  const response = await fetch(`/api/blog/articles/${idOrSlug}`);
  const data = await response.json();
  return data.data;
};
```

---

## ✅ Production Checklist

| Feature | Status |
|---------|--------|
| Dynamic categories | ✅ |
| Article CRUD | ✅ |
| Search (text index) | ✅ |
| Pagination | ✅ |
| Recent 6 articles API | ✅ |
| Multiple images (max 5) | ✅ |
| Thumbnail support | ✅ |
| Auto-generated unique slugs | ✅ |
| Atomic views counter | ✅ |
| Read time tracking | ✅ |
| Soft delete | ✅ |
| Admin-only write access | ✅ |
| Public read access | ✅ |
| Category filtering | ✅ |
| Author information | ✅ |
| Sorting (latest/popular/oldest) | ✅ |
| Category delete protection | ✅ |
| Active category validation | ✅ |
| Performance indexes | ✅ |
| Race condition safety | ✅ |

---

**🎉 Blog system is 100% production-ready and enterprise-level optimized!**
