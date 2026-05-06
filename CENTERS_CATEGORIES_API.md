# Centers & Categories Management API

Complete API reference for managing centers and categories.

---

## 🔐 Authentication

All endpoints require authentication with a valid JWT token:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Access Level:** Super Admin only (except GET categories which allows Center Admin too)

---

# 📍 Centers Management

## 1. List All Centers

**GET** `/api/admin/centers`

### Request:
```bash
GET http://localhost:5000/api/admin/centers
Authorization: Bearer YOUR_TOKEN
```

### Response:
```json
{
  "success": true,
  "centers": [
    {
      "_id": "6789abcd1234efgh5678ijkl",
      "name": "Delhi",
      "centerAdmin": null,
      "createdAt": "2026-04-07T10:00:00.000Z",
      "updatedAt": "2026-04-07T10:00:00.000Z"
    },
    {
      "_id": "1234abcd5678efgh9012ijkl",
      "name": "Hyderabad",
      "centerAdmin": {
        "_id": "user_id",
        "name": "Admin Name",
        "email": "admin@example.com"
      },
      "createdAt": "2026-04-07T09:00:00.000Z",
      "updatedAt": "2026-04-07T09:00:00.000Z"
    }
  ]
}
```

---

## 2. Create Center

**POST** `/api/admin/centers`

### Request:
```bash
POST http://localhost:5000/api/admin/centers
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Pune"
}
```

### Success Response (201):
```json
{
  "success": true,
  "message": "Center created successfully",
  "center": {
    "_id": "center_id_here",
    "name": "Pune",
    "centerAdmin": null,
    "createdAt": "2026-04-07T10:00:00.000Z",
    "updatedAt": "2026-04-07T10:00:00.000Z"
  }
}
```

### Error Response (400):
```json
{
  "message": "Center name is required"
}
```

OR

```json
{
  "message": "Center already exists with this name"
}
```

---

## 3. Update Center

**PUT** `/api/admin/centers/:id`

### Request:
```bash
PUT http://localhost:5000/api/admin/centers/6789abcd1234efgh5678ijkl
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "New Delhi"
}
```

### Success Response:
```json
{
  "success": true,
  "message": "Center updated successfully",
  "center": {
    "_id": "6789abcd1234efgh5678ijkl",
    "name": "New Delhi",
    "centerAdmin": null,
    "createdAt": "2026-04-07T10:00:00.000Z",
    "updatedAt": "2026-04-07T11:00:00.000Z"
  }
}
```

### Error Responses:

**Center not found (404):**
```json
{
  "message": "Center not found"
}
```

**Name already exists (400):**
```json
{
  "message": "Another center already exists with this name"
}
```

---

## 4. Delete Center

**DELETE** `/api/admin/centers/:id`

### Request:
```bash
DELETE http://localhost:5000/api/admin/centers/6789abcd1234efgh5678ijkl
Authorization: Bearer YOUR_TOKEN
```

### Success Response:
```json
{
  "success": true,
  "message": "Center deleted successfully"
}
```

### Error Responses:

**Center not found (404):**
```json
{
  "message": "Center not found"
}
```

**Has associated courses (400):**
```json
{
  "message": "Cannot delete center. It has 5 course(s) associated with it. Delete the courses first."
}
```

---

# 📚 Categories Management

## 1. List All Categories

**GET** `/api/admin/categories`

### Request:
```bash
GET http://localhost:5000/api/admin/categories
Authorization: Bearer YOUR_TOKEN
```

### Response:
```json
{
  "success": true,
  "categories": [
    {
      "_id": "1234abcd5678efgh9012ijkl",
      "name": "GS Foundation",
      "createdAt": "2026-04-07T10:00:00.000Z",
      "updatedAt": "2026-04-07T10:00:00.000Z"
    },
    {
      "_id": "2345bcde6789fghi0123jklm",
      "name": "Optional Subjects",
      "createdAt": "2026-04-07T09:00:00.000Z",
      "updatedAt": "2026-04-07T09:00:00.000Z"
    }
  ]
}
```

---

## 2. Create Category

**POST** `/api/admin/categories`

### Request:
```bash
POST http://localhost:5000/api/admin/categories
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Test Series"
}
```

### Success Response (201):
```json
{
  "success": true,
  "message": "Category created successfully",
  "category": {
    "_id": "category_id_here",
    "name": "Test Series",
    "createdAt": "2026-04-07T10:00:00.000Z",
    "updatedAt": "2026-04-07T10:00:00.000Z"
  }
}
```

### Error Response (400):
```json
{
  "message": "Category name is required"
}
```

OR

```json
{
  "message": "Category already exists with this name"
}
```

---

## 3. Update Category

**PUT** `/api/admin/categories/:id`

### Request:
```bash
PUT http://localhost:5000/api/admin/categories/1234abcd5678efgh9012ijkl
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "GS Foundation Advanced"
}
```

### Success Response:
```json
{
  "success": true,
  "message": "Category updated successfully",
  "category": {
    "_id": "1234abcd5678efgh9012ijkl",
    "name": "GS Foundation Advanced",
    "createdAt": "2026-04-07T10:00:00.000Z",
    "updatedAt": "2026-04-07T11:00:00.000Z"
  }
}
```

### Error Responses:

**Category not found (404):**
```json
{
  "message": "Category not found"
}
```

**Name already exists (400):**
```json
{
  "message": "Another category already exists with this name"
}
```

---

## 4. Delete Category

**DELETE** `/api/admin/categories/:id`

### Request:
```bash
DELETE http://localhost:5000/api/admin/categories/1234abcd5678efgh9012ijkl
Authorization: Bearer YOUR_TOKEN
```

### Success Response:
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

### Error Responses:

**Category not found (404):**
```json
{
  "message": "Category not found"
}
```

**Has associated courses (400):**
```json
{
  "message": "Cannot delete category. It has 3 course(s) associated with it. Delete the courses first."
}
```

---

# 🧪 Testing with cURL

## Centers

### Create Center:
```bash
curl -X POST http://localhost:5000/api/admin/centers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Bangalore"}'
```

### List Centers:
```bash
curl -X GET http://localhost:5000/api/admin/centers \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Center:
```bash
curl -X PUT http://localhost:5000/api/admin/centers/CENTER_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Bengaluru"}'
```

### Delete Center:
```bash
curl -X DELETE http://localhost:5000/api/admin/centers/CENTER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Categories

### Create Category:
```bash
curl -X POST http://localhost:5000/api/admin/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Crash Courses"}'
```

### List Categories:
```bash
curl -X GET http://localhost:5000/api/admin/categories \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Category:
```bash
curl -X PUT http://localhost:5000/api/admin/categories/CATEGORY_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Intensive Crash Courses"}'
```

### Delete Category:
```bash
curl -X DELETE http://localhost:5000/api/admin/categories/CATEGORY_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

# 📊 Quick Reference Table

## Centers Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/centers` | Super Admin | List all centers |
| POST | `/api/admin/centers` | Super Admin | Create new center |
| PUT | `/api/admin/centers/:id` | Super Admin | Update center |
| DELETE | `/api/admin/centers/:id` | Super Admin | Delete center |

## Categories Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/categories` | Super Admin, Center Admin | List all categories |
| POST | `/api/admin/categories` | Super Admin | Create new category |
| PUT | `/api/admin/categories/:id` | Super Admin | Update category |
| DELETE | `/api/admin/categories/:id` | Super Admin | Delete category |

---

# ⚠️ Important Notes

## Safety Features:

1. **Unique Names**: Both centers and categories must have unique names
2. **Delete Protection**: Cannot delete if courses are associated
3. **Validation**: All required fields are validated
4. **Error Messages**: Clear error messages for all failure cases

## Before Deleting:

- ✅ Delete or reassign all courses associated with the center/category
- ✅ Verify you're deleting the correct item
- ✅ This action cannot be undone

## Common Workflow:

1. Create centers (Delhi, Hyderabad, Pune)
2. Create categories (GS Foundation, Optional Subjects, etc.)
3. Use them to create courses
4. Update names if needed
5. Delete only if no courses are associated

---

# 🚀 Complete Example Workflow

```bash
# 1. Create Delhi Center
POST /api/admin/centers
{ "name": "Delhi" }
→ Returns center ID: center_123

# 2. Create GS Foundation Category
POST /api/admin/categories
{ "name": "GS Foundation" }
→ Returns category ID: category_456

# 3. List all centers to verify
GET /api/admin/centers

# 4. Update center name
PUT /api/admin/centers/center_123
{ "name": "New Delhi" }

# 5. Try to delete (will fail if courses exist)
DELETE /api/admin/centers/center_123
```

---

**Need Help?** Check [COURSE_CREATION_GUIDE.md](./COURSE_CREATION_GUIDE.md) for complete course setup instructions.
