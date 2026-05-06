# Top Stories API Testing Guide

## Base URL
```
http://localhost:5000/api/top-stories
```

## Authentication
Most endpoints require authentication with `super_admin` or `admin` role. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Overview
Top Stories is a **standalone** content management system for highlighting important news/stories. Each top story has:
- Title
- Description
- Thumbnail (single image)
- Author Name
- Date

---

## 1. Create Top Story

**Endpoint:** `POST /api/top-stories`

**Access:** Private (Super Admin & Admin only)

**Content-Type:** `multipart/form-data`

**Form Data Fields:**
- `title` (text, required): Story title (max 200 characters)
- `description` (text, required): Story description (max 1000 characters)
- `authorName` (text, required): Author name
- `date` (text, optional): Story date (ISO format, defaults to current date)
- `thumbnail` (file, required): Thumbnail image (JPEG, PNG, WebP, AVIF, GIF - max 5MB)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Top story created successfully",
  "data": {
    "_id": "6756def456abc78901234567",
    "title": "Breaking News: Major Policy Change",
    "description": "Government announces new policy reforms affecting millions",
    "thumbnail": {
      "url": "https://res.cloudinary.com/demo/image/upload/top-stories/thumbnails/abc123.jpg",
      "publicId": "top-stories/thumbnails/abc123"
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

**400 - Missing thumbnail:**
```json
{
  "success": false,
  "message": "Thumbnail image is required"
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
curl -X POST http://localhost:5000/api/top-stories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Breaking News: Major Policy Change" \
  -F "description=Government announces new policy reforms" \
  -F "authorName=John Doe" \
  -F "date=2026-04-18" \
  -F "thumbnail=@/path/to/thumbnail-image.jpg"
```

---

## 2. Get All Top Stories

**Endpoint:** `GET /api/top-stories`

**Access:** Public

**Query Parameters:**
- `limit` (optional): Number of stories per page
- `page` (optional): Page number (default: 1)

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "6756def456abc78901234567",
      "title": "Breaking News: Major Policy Change",
      "description": "Government announces new policy reforms affecting millions",
      "thumbnail": {
        "url": "https://res.cloudinary.com/demo/image/upload/top-stories/thumbnails/abc123.jpg",
        "publicId": "top-stories/thumbnails/abc123"
      },
      "authorName": "John Doe",
      "date": "2026-04-18T10:30:00.000Z",
      "isActive": true,
      "createdAt": "2026-04-18T10:30:00.000Z",
      "updatedAt": "2026-04-18T10:30:00.000Z"
    },
    {
      "_id": "6756def456abc78901234568",
      "title": "Economic Summit 2026",
      "description": "Global leaders gather to discuss economic recovery",
      "thumbnail": {
        "url": "https://res.cloudinary.com/demo/image/upload/top-stories/thumbnails/def456.jpg",
        "publicId": "top-stories/thumbnails/def456"
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
GET /api/top-stories?limit=2&page=1
```

**cURL Example:**
```bash
# Get all top stories
curl http://localhost:5000/api/top-stories

# Get paginated top stories
curl "http://localhost:5000/api/top-stories?limit=2&page=1"
```

---

## 3. Get Single Top Story

**Endpoint:** `GET /api/top-stories/:id`

**Access:** Public

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "6756def456abc78901234567",
    "title": "Breaking News: Major Policy Change",
    "description": "Government announces new policy reforms affecting millions",
    "thumbnail": {
      "url": "https://res.cloudinary.com/demo/image/upload/top-stories/thumbnails/abc123.jpg",
      "publicId": "top-stories/thumbnails/abc123"
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
  "message": "Top story not found"
}
```

**cURL Example:**
```bash
curl http://localhost:5000/api/top-stories/6756def456abc78901234567
```

---

## 4. Update Top Story

**Endpoint:** `PUT /api/top-stories/:id`

**Access:** Private (Super Admin & Admin only)

**Content-Type:** `multipart/form-data`

**Form Data Fields (all optional):**
- `title` (text): Story title (max 200 characters)
- `description` (text): Story description (max 1000 characters)
- `authorName` (text): Author name
- `date` (text): Story date (ISO format)
- `thumbnail` (file): New thumbnail image (JPEG, PNG, WebP, AVIF, GIF - max 5MB)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Top story updated successfully",
  "data": {
    "_id": "6756def456abc78901234567",
    "title": "Updated: Major Policy Change Announced",
    "description": "Updated description with latest developments",
    "thumbnail": {
      "url": "https://res.cloudinary.com/demo/image/upload/top-stories/thumbnails/new123.jpg",
      "publicId": "top-stories/thumbnails/new123"
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

**404 - Top story not found:**
```json
{
  "success": false,
  "message": "Top story not found"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/top-stories/6756def456abc78901234567 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Updated: Major Policy Change Announced" \
  -F "description=Updated description with latest developments" \
  -F "authorName=Jane Smith" \
  -F "thumbnail=@/path/to/new-thumbnail.jpg"
```

---

## 5. Delete Top Story

**Endpoint:** `DELETE /api/top-stories/:id`

**Access:** Private (Super Admin & Admin only)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Top story deleted successfully",
  "data": {
    "_id": "6756def456abc78901234567",
    "title": "Breaking News: Major Policy Change",
    "description": "Government announces new policy reforms affecting millions",
    "thumbnail": {
      "url": "https://res.cloudinary.com/demo/image/upload/top-stories/thumbnails/abc123.jpg",
      "publicId": "top-stories/thumbnails/abc123"
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

**404 - Top story not found:**
```json
{
  "success": false,
  "message": "Top story not found"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/top-stories/6756def456abc78901234567 \
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

#### 1. Create Top Story
- [ ] Create with all required fields and thumbnail
- [ ] Try without thumbnail (should fail)
- [ ] Try without title (should fail)
- [ ] Try without description (should fail)
- [ ] Try without author name (should fail)
- [ ] Try with title exceeding 200 characters (should fail)
- [ ] Try with description exceeding 1000 characters (should fail)
- [ ] Try without authentication (should fail)
- [ ] Try with non-admin user (should fail)

#### 2. Get All Top Stories
- [ ] Get all top stories (public access)
- [ ] Get with limit parameter
- [ ] Get with pagination (limit + page)
- [ ] Verify sorting by createdAt (newest first)
- [ ] Verify response format matches expected structure
- [ ] Verify deleted/inactive stories are filtered out

#### 3. Get Single Top Story
- [ ] Get existing top story
- [ ] Try getting non-existent story (should fail)
- [ ] Try getting deleted story (should fail)

#### 4. Update Top Story
- [ ] Update title only
- [ ] Update description only
- [ ] Update author name only
- [ ] Update date only
- [ ] Update thumbnail only
- [ ] Update all fields at once
- [ ] Try updating non-existent top story (should fail)
- [ ] Try without authentication (should fail)
- [ ] Try with non-admin user (should fail)

#### 5. Delete Top Story
- [ ] Delete existing top story
- [ ] Try deleting non-existent top story (should fail)
- [ ] Try without authentication (should fail)
- [ ] Try with non-admin user (should fail)
- [ ] Verify deleted story doesn't appear in GET list

---

## Postman Collection Setup

### Environment Variables
Create a Postman environment with:
- `base_url`: `http://localhost:5000`
- `token`: Your JWT token
- `top_story_id`: ID of a created top story (for testing update/delete)

### Request Examples

**1. Create Top Story:**
```
POST {{base_url}}/api/top-stories
Headers:
  Authorization: Bearer {{token}}
Body (form-data):
  title: Breaking News: Major Policy Change
  description: Government announces new policy reforms
  authorName: John Doe
  date: 2026-04-18
  thumbnail: [Select File]
```

**2. Get All Top Stories:**
```
GET {{base_url}}/api/top-stories
Headers:
  (No authentication required)
Query Params:
  limit: 10 (optional)
  page: 1 (optional)
```

**3. Get Single Top Story:**
```
GET {{base_url}}/api/top-stories/{{top_story_id}}
Headers:
  (No authentication required)
```

**4. Update Top Story:**
```
PUT {{base_url}}/api/top-stories/{{top_story_id}}
Headers:
  Authorization: Bearer {{token}}
Body (form-data):
  title: Updated Title (optional)
  description: Updated description (optional)
  authorName: Jane Smith (optional)
  date: 2026-04-19 (optional)
  thumbnail: [Select File] (optional)
```

**5. Delete Top Story:**
```
DELETE {{base_url}}/api/top-stories/{{top_story_id}}
Headers:
  Authorization: Bearer {{token}}
```

---

## Notes

1. **Standalone System:** Top Stories is completely independent from Blog Articles and Featured Articles
2. **Image Upload:** Thumbnails are automatically uploaded to Cloudinary in the `top-stories/thumbnails` folder
3. **Soft Delete:** Deleting a top story sets `isActive: false` instead of removing the record
4. **Validation:** 
   - Title: Required, max 200 characters
   - Description: Required, max 1000 characters
   - Author Name: Required
   - Thumbnail: Required (JPEG, PNG, WebP, AVIF, GIF - max 5MB)
5. **Access Control:** Only `super_admin` and `admin` roles can create, update, or delete top stories
6. **Public Access:** Anyone can view top stories (both list and single)
7. **Pagination:** Supports limit and page query parameters for list endpoint
8. **Automatic Date:** If date is not provided, it defaults to current date/time
9. **Image Replacement:** When updating thumbnail, old image is automatically deleted from Cloudinary

---

## Common Issues & Solutions

### Issue: "Thumbnail image is required"
**Solution:** Ensure you're uploading a thumbnail using form-data (not JSON). In Postman, use the "form-data" tab and select a file for the thumbnail field.

### Issue: "Title is required" or other validation errors
**Solution:** Check that all required fields are provided: title, description, authorName, and thumbnail.

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

### Issue: Top story not found
**Solution:** Verify the top story ID is correct and the story exists and is active.
