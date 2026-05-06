# Featured Articles API Testing Guide

## Base URL
```
http://localhost:5000/api/featured-articles
```

## Authentication
Most endpoints require authentication with `super_admin` or `admin` role. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Overview
Featured Articles is a **standalone** content management system with its own fields, completely independent from the Blog Article system. Each featured article has:
- Title
- Description
- Main Image
- Secondary Image
- Author Name
- Date

---

## 1. Create Featured Article

**Endpoint:** `POST /api/featured-articles`

**Access:** Private (Super Admin & Admin only)

**Content-Type:** `multipart/form-data`

**Form Data Fields:**
- `title` (text, required): Article title (max 200 characters)
- `description` (text, required): Article description (max 1000 characters)
- `authorName` (text, required): Author name
- `date` (text, optional): Article date (ISO format, defaults to current date)
- `mainImage` (file, required): Main/hero image (JPEG, PNG, WebP, AVIF, GIF - max 5MB)
- `secondaryImage` (file, required): Secondary image (JPEG, PNG, WebP, AVIF, GIF - max 5MB)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Featured article created successfully",
  "data": {
    "_id": "6756def456abc78901234567",
    "title": "How to Learn Programming",
    "description": "A comprehensive guide to learning programming from scratch",
    "mainImage": {
      "url": "https://res.cloudinary.com/demo/image/upload/featured-articles/main/abc123.jpg",
      "publicId": "featured-articles/main/abc123"
    },
    "secondaryImage": {
      "url": "https://res.cloudinary.com/demo/image/upload/featured-articles/secondary/def456.jpg",
      "publicId": "featured-articles/secondary/def456"
    },
    "authorName": "John Doe",
    "date": "2026-04-18T10:30:00.000Z",
    "isActive": true,
    "createdBy": "6756ghi789jkl01234567890",
    "createdAt": "2026-04-18T10:30:00.000Z",
    "updatedAt": "2026-04-18T10:30:00.000Z"
  }
}
```

**Error Responses:**

**400 - Missing images:**
```json
{
  "success": false,
  "message": "Both main image and secondary image are required"
}
```

**400 - Validation error:**
```json
{
  "success": false,
  "message": "Title is required"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/featured-articles \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=How to Learn Programming" \
  -F "description=A comprehensive guide to learning programming" \
  -F "authorName=John Doe" \
  -F "date=2026-04-18" \
  -F "mainImage=@/path/to/main-image.jpg" \
  -F "secondaryImage=@/path/to/secondary-image.jpg"
```

---

## 2. Get All Featured Articles

**Endpoint:** `GET /api/featured-articles`

**Access:** Public

**Query Parameters:**
- `limit` (optional): Number of articles per page
- `page` (optional): Page number (default: 1)

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "6756def456abc78901234567",
      "title": "How to Learn Programming",
      "description": "A comprehensive guide to learning programming from scratch",
      "mainImage": {
        "url": "https://res.cloudinary.com/demo/image/upload/featured-articles/main/abc123.jpg",
        "publicId": "featured-articles/main/abc123"
      },
      "secondaryImage": {
        "url": "https://res.cloudinary.com/demo/image/upload/featured-articles/secondary/def456.jpg",
        "publicId": "featured-articles/secondary/def456"
      },
      "authorName": "John Doe",
      "date": "2026-04-18T10:30:00.000Z",
      "isActive": true,
      "createdAt": "2026-04-18T10:30:00.000Z",
      "updatedAt": "2026-04-18T10:30:00.000Z"
    },
    {
      "_id": "6756def456abc78901234568",
      "title": "Best Coding Practices",
      "description": "Top 10 coding practices every developer should know",
      "mainImage": {
        "url": "https://res.cloudinary.com/demo/image/upload/featured-articles/main/ghi789.jpg",
        "publicId": "featured-articles/main/ghi789"
      },
      "secondaryImage": {
        "url": "https://res.cloudinary.com/demo/image/upload/featured-articles/secondary/jkl012.jpg",
        "publicId": "featured-articles/secondary/jkl012"
      },
      "authorName": "Jane Smith",
      "date": "2026-04-17T09:00:00.000Z",
      "isActive": true,
      "createdAt": "2026-04-17T09:00:00.000Z",
      "updatedAt": "2026-04-17T09:00:00.000Z"
    }
  ]
}
```

**Example with Pagination:**
```
GET /api/featured-articles?limit=2&page=1
```

**cURL Example:**
```bash
# Get all featured articles
curl http://localhost:5000/api/featured-articles

# Get paginated featured articles
curl "http://localhost:5000/api/featured-articles?limit=2&page=1"
```

---

## 3. Get Single Featured Article

**Endpoint:** `GET /api/featured-articles/:id`

**Access:** Public

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "6756def456abc78901234567",
    "title": "How to Learn Programming",
    "description": "A comprehensive guide to learning programming from scratch",
    "mainImage": {
      "url": "https://res.cloudinary.com/demo/image/upload/featured-articles/main/abc123.jpg",
      "publicId": "featured-articles/main/abc123"
    },
    "secondaryImage": {
      "url": "https://res.cloudinary.com/demo/image/upload/featured-articles/secondary/def456.jpg",
      "publicId": "featured-articles/secondary/def456"
    },
    "authorName": "John Doe",
    "date": "2026-04-18T10:30:00.000Z",
    "isActive": true,
    "createdBy": "6756ghi789jkl01234567890",
    "createdAt": "2026-04-18T10:30:00.000Z",
    "updatedAt": "2026-04-18T10:30:00.000Z"
  }
}
```

**Error Response:**

**404 - Not found:**
```json
{
  "success": false,
  "message": "Featured article not found"
}
```

**cURL Example:**
```bash
curl http://localhost:5000/api/featured-articles/6756def456abc78901234567
```

---

## 4. Update Featured Article

**Endpoint:** `PUT /api/featured-articles/:id`

**Access:** Private (Super Admin & Admin only)

**Content-Type:** `multipart/form-data`

**Form Data Fields (all optional):**
- `title` (text): Article title (max 200 characters)
- `description` (text): Article description (max 1000 characters)
- `authorName` (text): Author name
- `date` (text): Article date (ISO format)
- `mainImage` (file): New main image (JPEG, PNG, WebP, AVIF, GIF - max 5MB)
- `secondaryImage` (file): New secondary image (JPEG, PNG, WebP, AVIF, GIF - max 5MB)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Featured article updated successfully",
  "data": {
    "_id": "6756def456abc78901234567",
    "title": "Updated Title",
    "description": "Updated description",
    "mainImage": {
      "url": "https://res.cloudinary.com/demo/image/upload/featured-articles/main/new123.jpg",
      "publicId": "featured-articles/main/new123"
    },
    "secondaryImage": {
      "url": "https://res.cloudinary.com/demo/image/upload/featured-articles/secondary/new456.jpg",
      "publicId": "featured-articles/secondary/new456"
    },
    "authorName": "Jane Smith",
    "date": "2026-04-19T10:30:00.000Z",
    "isActive": true,
    "createdBy": "6756ghi789jkl01234567890",
    "createdAt": "2026-04-18T10:30:00.000Z",
    "updatedAt": "2026-04-19T11:00:00.000Z"
  }
}
```

**Error Responses:**

**404 - Featured article not found:**
```json
{
  "success": false,
  "message": "Featured article not found"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/featured-articles/6756def456abc78901234567 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Updated Title" \
  -F "description=Updated description" \
  -F "authorName=Jane Smith" \
  -F "mainImage=@/path/to/new-main-image.jpg"
```

---

## 5. Delete Featured Article

**Endpoint:** `DELETE /api/featured-articles/:id`

**Access:** Private (Super Admin & Admin only)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Featured article deleted successfully",
  "data": {
    "_id": "6756def456abc78901234567",
    "title": "How to Learn Programming",
    "description": "A comprehensive guide to learning programming from scratch",
    "mainImage": {
      "url": "https://res.cloudinary.com/demo/image/upload/featured-articles/main/abc123.jpg",
      "publicId": "featured-articles/main/abc123"
    },
    "secondaryImage": {
      "url": "https://res.cloudinary.com/demo/image/upload/featured-articles/secondary/def456.jpg",
      "publicId": "featured-articles/secondary/def456"
    },
    "authorName": "John Doe",
    "date": "2026-04-18T10:30:00.000Z",
    "isActive": false,
    "createdBy": "6756ghi789jkl01234567890",
    "createdAt": "2026-04-18T10:30:00.000Z",
    "updatedAt": "2026-04-18T12:00:00.000Z"
  }
}
```

**Error Response:**

**404 - Featured article not found:**
```json
{
  "success": false,
  "message": "Featured article not found"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/featured-articles/6756def456abc78901234567 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Testing Checklist

### Prerequisites
- [ ] Server is running on port 5000
- [ ] Database is connected
- [ ] Cloudinary is configured
- [ ] You have an admin or super_admin account
- [ ] You have valid JWT token

### Test Scenarios

#### 1. Create Featured Article
- [ ] Create with all required fields and images
- [ ] Try without main image (should fail)
- [ ] Try without secondary image (should fail)
- [ ] Try without title (should fail)
- [ ] Try without description (should fail)
- [ ] Try without author name (should fail)
- [ ] Try with title exceeding 200 characters (should fail)
- [ ] Try with description exceeding 1000 characters (should fail)
- [ ] Try without authentication (should fail)
- [ ] Try with non-admin user (should fail)

#### 2. Get All Featured Articles
- [ ] Get all featured articles (public access)
- [ ] Get with limit parameter
- [ ] Get with pagination (limit + page)
- [ ] Verify sorting by createdAt (newest first)
- [ ] Verify response format matches expected structure
- [ ] Verify deleted/inactive articles are filtered out

#### 3. Get Single Featured Article
- [ ] Get existing featured article
- [ ] Try getting non-existent article (should fail)
- [ ] Try getting deleted article (should fail)

#### 4. Update Featured Article
- [ ] Update title only
- [ ] Update description only
- [ ] Update author name only
- [ ] Update date only
- [ ] Update main image only
- [ ] Update secondary image only
- [ ] Update all fields at once
- [ ] Try updating non-existent featured article (should fail)
- [ ] Try without authentication (should fail)
- [ ] Try with non-admin user (should fail)

#### 5. Delete Featured Article
- [ ] Delete existing featured article
- [ ] Try deleting non-existent featured article (should fail)
- [ ] Try without authentication (should fail)
- [ ] Try with non-admin user (should fail)
- [ ] Verify deleted article doesn't appear in GET list

---

## Postman Collection Setup

### Environment Variables
Create a Postman environment with:
- `base_url`: `http://localhost:5000`
- `token`: Your JWT token
- `featured_article_id`: ID of a created featured article (for testing update/delete)

### Request Examples

**1. Create Featured Article:**
```
POST {{base_url}}/api/featured-articles
Headers:
  Authorization: Bearer {{token}}
Body (form-data):
  title: How to Learn Programming
  description: A comprehensive guide to learning programming
  authorName: John Doe
  date: 2026-04-18
  mainImage: [Select File]
  secondaryImage: [Select File]
```

**2. Get All Featured Articles:**
```
GET {{base_url}}/api/featured-articles
Headers:
  (No authentication required)
Query Params:
  limit: 10 (optional)
  page: 1 (optional)
```

**3. Get Single Featured Article:**
```
GET {{base_url}}/api/featured-articles/{{featured_article_id}}
Headers:
  (No authentication required)
```

**4. Update Featured Article:**
```
PUT {{base_url}}/api/featured-articles/{{featured_article_id}}
Headers:
  Authorization: Bearer {{token}}
Body (form-data):
  title: Updated Title (optional)
  description: Updated description (optional)
  authorName: Jane Smith (optional)
  date: 2026-04-19 (optional)
  mainImage: [Select File] (optional)
  secondaryImage: [Select File] (optional)
```

**5. Delete Featured Article:**
```
DELETE {{base_url}}/api/featured-articles/{{featured_article_id}}
Headers:
  Authorization: Bearer {{token}}
```

---

## Notes

1. **Standalone System:** Featured Articles is completely independent from Blog Articles
2. **Image Upload:** Images are automatically uploaded to Cloudinary in separate folders (`featured-articles/main` and `featured-articles/secondary`)
3. **Soft Delete:** Deleting a featured article sets `isActive: false` instead of removing the record
4. **Validation:** 
   - Title: Required, max 200 characters
   - Description: Required, max 1000 characters
   - Author Name: Required
   - Main Image: Required (JPEG, PNG, WebP, AVIF, GIF - max 5MB)
   - Secondary Image: Required (JPEG, PNG, WebP, AVIF, GIF - max 5MB)
5. **Access Control:** Only `super_admin` and `admin` roles can create, update, or delete featured articles
6. **Public Access:** Anyone can view featured articles (both list and single)
7. **Pagination:** Supports limit and page query parameters for list endpoint
8. **Automatic Date:** If date is not provided, it defaults to current date/time
9. **Image Replacement:** When updating images, old images are automatically deleted from Cloudinary

---

## Common Issues & Solutions

### Issue: "Both main image and secondary image are required"
**Solution:** Ensure you're uploading both images using form-data (not JSON). In Postman, use the "form-data" tab and select files for both image fields.

### Issue: "Title is required" or other validation errors
**Solution:** Check that all required fields are provided: title, description, authorName, mainImage, and secondaryImage.

### Issue: "Title cannot exceed 200 characters"
**Solution:** Shorten your title to be within the 200 character limit.

### Issue: "Description cannot exceed 1000 characters"
**Solution:** Shorten your description to be within the 1000 character limit.

### Issue: "Invalid file type"
**Solution:** Only JPEG, PNG, WebP, AVIF, and GIF images are allowed. Check your file format.

### Issue: Unauthorized access
**Solution:** Verify your JWT token is valid and your user has `super_admin` or `admin` role.

### Issue: Images not uploading
**Solution:** 
- Make sure you're using `multipart/form-data` content type (not `application/json`)
- In Postman, don't set Content-Type header manually - let Postman set it automatically when using form-data
- Check that Cloudinary is properly configured in your `.env` file

### Issue: Featured article not found
**Solution:** Verify the featured article ID is correct and the article exists and is active.
