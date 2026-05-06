# 🚀 Free Resources CMS - Quick Start Guide

## 📦 What Was Built

A complete **Dynamic Content Management System** for educational resources with:
- ✅ 6 MongoDB Models
- ✅ 4 Controllers
- ✅ 4 Route Files
- ✅ 30+ API Endpoints
- ✅ Role-based Access Control
- ✅ File Upload (PDF + Images)
- ✅ Mock Test Evaluation System

---

## 📁 Files Created

### Models (`/models`)
1. `ResourceCategory.js` - Main categories (NCERT, PYQ, etc.)
2. `SubCategory.js` - Sub-categories (Prelims, Mains, etc.)
3. `Filter.js` - Dynamic filters (Subject, Class, Paper, Year)
4. `Resource.js` - PDF resources and study material
5. `MockTest.js` - Mock tests with questions
6. `Result.js` - Student test results

### Controllers (`/controllers`)
1. `resourceCategoryController.js` - Category & SubCategory CRUD
2. `filterController.js` - Dynamic filter management
3. `resourceController.js` - Resource (PDF) management
4. `mockTestController.js` - Mock test & evaluation logic

### Routes (`/routes`)
1. `resourceRoutes.js` - Category & SubCategory routes
2. `filterRoutes.js` - Filter routes
3. `resourceFileRoutes.js` - Resource file routes
4. `mockTestRoutes.js` - Mock test & result routes

### Updated Files
- `app.js` - Added new route registrations
- `middleware/authMiddleware.js` - Added `protect` and `authorize` functions

---

## 🎯 Quick Setup (5 Steps)

### Step 1: Start Server
```bash
npm run dev
```

### Step 2: Create First Category
```bash
POST http://localhost:5000/api/resources/categories
Authorization: Bearer <your_token>
Content-Type: multipart/form-data

name: "NCERT Books"
description: "NCERT Books for all classes"
```

### Step 3: Create SubCategory
```bash
POST http://localhost:5000/api/resources/subcategories
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "name": "Prelims",
  "categoryId": "<category_id_from_step_2>"
}
```

### Step 4: Create Filters
```bash
POST http://localhost:5000/api/resources/filters
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "type": "SUBJECT",
  "value": "History",
  "categoryId": "<category_id>"
}
```

### Step 5: Upload Resource
```bash
POST http://localhost:5000/api/resources/files
Authorization: Bearer <your_token>
Content-Type: multipart/form-data

title: "NCERT History Class 10"
categoryId: "<category_id>"
subject: "History"
class: "10th"
file: <select_pdf_file>
```

---

## 🔑 API Endpoints Summary

### Categories
- `GET /api/resources/categories` - Get all categories (Public)
- `POST /api/resources/categories` - Create category (Admin)
- `PUT /api/resources/categories/:id` - Update category (Admin)
- `DELETE /api/resources/categories/:id` - Delete category (Admin)

### SubCategories
- `GET /api/resources/subcategories` - Get all subcategories (Public)
- `POST /api/resources/subcategories` - Create subcategory (Admin)
- `PUT /api/resources/subcategories/:id` - Update subcategory (Admin)
- `DELETE /api/resources/subcategories/:id` - Delete subcategory (Admin)

### Filters
- `GET /api/resources/filters` - Get all filters (Public)
- `GET /api/resources/filters/category/:categoryId` - Get filters by category (Public)
- `POST /api/resources/filters` - Create filter (Admin)
- `PUT /api/resources/filters/:id` - Update filter (Admin)
- `DELETE /api/resources/filters/:id` - Delete filter (Admin)

### Resources (PDFs)
- `GET /api/resources/files` - Get resources with filters (Public)
- `GET /api/resources/files/:id` - Get resource by ID (Public)
- `POST /api/resources/files` - Upload resource (Admin)
- `PUT /api/resources/files/:id` - Update resource (Admin)
- `DELETE /api/resources/files/:id` - Delete resource (Admin)

### Mock Tests
- `GET /api/resources/mock-tests` - Get all tests (Public)
- `GET /api/resources/mock-tests/:id` - Get test by ID (Public)
- `POST /api/resources/mock-tests` - Create test (Admin)
- `PUT /api/resources/mock-tests/:id` - Update test (Admin)
- `DELETE /api/resources/mock-tests/:id` - Delete test (Admin)

### Test Attempts
- `POST /api/resources/mock-tests/attempt` - Submit test (Student)
- `GET /api/resources/mock-tests/results` - Get user results (Student)
- `GET /api/resources/mock-tests/results/:id` - Get result details (Student)

---

## 🔐 Role Permissions

| Endpoint | super_admin | center_admin | student | parent |
|----------|-------------|--------------|---------|--------|
| Create Category | ✅ | ✅ | ❌ | ❌ |
| Create SubCategory | ✅ | ✅ | ❌ | ❌ |
| Create Filter | ✅ | ✅ | ❌ | ❌ |
| Upload Resource | ✅ | ✅ | ❌ | ❌ |
| Create Mock Test | ✅ | ✅ | ❌ | ❌ |
| View Resources | ✅ | ✅ | ✅ | ✅ |
| Attempt Test | ❌ | ❌ | ✅ | ✅ |
| View Results | ✅ | ✅ | ✅ (own) | ✅ (own) |

---

## 📊 Example: Complete NCERT Setup

### 1. Create NCERT Category
```json
POST /api/resources/categories
{
  "name": "NCERT Books"
}
```

### 2. Create Class SubCategories
```json
POST /api/resources/subcategories
{ "name": "Class 10", "categoryId": "<ncert_id>" }

POST /api/resources/subcategories
{ "name": "Class 11", "categoryId": "<ncert_id>" }
```

### 3. Create Subject Filters
```json
POST /api/resources/filters
{ "type": "SUBJECT", "value": "History", "categoryId": "<ncert_id>" }

POST /api/resources/filters
{ "type": "SUBJECT", "value": "Geography", "categoryId": "<ncert_id>" }

POST /api/resources/filters
{ "type": "SUBJECT", "value": "Polity", "categoryId": "<ncert_id>" }
```

### 4. Create Class Filters
```json
POST /api/resources/filters
{ "type": "CLASS", "value": "10th", "categoryId": "<ncert_id>" }

POST /api/resources/filters
{ "type": "CLASS", "value": "11th", "categoryId": "<ncert_id>" }
```

### 5. Upload Resources
```bash
POST /api/resources/files
{
  "title": "NCERT History Class 10 - Chapter 1",
  "categoryId": "<ncert_id>",
  "subject": "History",
  "class": "10th",
  "file": <pdf_file>
}
```

### 6. Query Resources
```bash
# Get all History books for Class 10
GET /api/resources/files?categoryId=<ncert_id>&subject=History&class=10th

# Get all Class 10 books
GET /api/resources/files?categoryId=<ncert_id>&class=10th
```

---

## 🧪 Testing with Postman

### 1. Import Collection
Create a new Postman collection with these folders:
- Categories
- SubCategories
- Filters
- Resources
- Mock Tests
- Test Attempts

### 2. Set Up Environment Variables
```
base_url: http://localhost:5000/api/resources
token: <your_jwt_token>
category_id: <created_category_id>
subcategory_id: <created_subcategory_id>
```

### 3. Test Workflow
1. Login and get token
2. Create category → Save ID
3. Create subcategory → Save ID
4. Create filters
5. Upload resource
6. Create mock test
7. Attempt test (as student)
8. View results

---

## 🐛 Common Issues & Solutions

### Issue: "Not authorized, no token"
**Solution:** Add `Authorization: Bearer <token>` header

### Issue: "User role 'student' is not authorized"
**Solution:** Use admin account for create/update/delete operations

### Issue: File upload fails
**Solution:** Ensure `Content-Type: multipart/form-data` is set

### Issue: Filter duplicate error
**Solution:** Filter with same type, value, and categoryId already exists

### Issue: Cannot delete category
**Solution:** Delete all associated subcategories and resources first

---

## 📝 Database Collections

After setup, you'll have these MongoDB collections:
- `resourcecategories` - Main categories
- `subcategories` - Sub-categories
- `filters` - Dynamic filters
- `resources` - PDF resources
- `mocktests` - Mock tests
- `results` - Test results

---

## 🎓 Next: Frontend Integration

### React/Next.js Example

```javascript
// Fetch categories
const categories = await fetch('/api/resources/categories');

// Fetch filters for a category
const filters = await fetch(`/api/resources/filters/category/${categoryId}`);

// Fetch resources with filters
const resources = await fetch(
  `/api/resources/files?categoryId=${categoryId}&subject=${subject}&class=${class}`
);

// Submit test
const result = await fetch('/api/resources/mock-tests/attempt', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    testId,
    answers,
    timeTaken
  })
});
```

---

## ✅ Checklist

- [x] All models created
- [x] All controllers created
- [x] All routes created
- [x] Middleware updated
- [x] app.js updated
- [x] Role-based access implemented
- [x] File upload configured
- [x] Test evaluation logic implemented
- [x] API documentation created

---

## 📚 Full Documentation

See `FREE_RESOURCES_API_GUIDE.md` for complete API documentation with examples.

---

**🎉 You're all set! Start building your Free Resources platform!**
