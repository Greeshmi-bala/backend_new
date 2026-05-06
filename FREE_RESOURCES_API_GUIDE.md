# 📚 Free Resources CMS - Complete API Guide

## 🔷 Overview

This is a **dynamic content management system** for managing free educational resources including:
- 📘 NCERT Books
- 📄 Previous Year Question Papers (PYQ)
- 🧠 Mock Tests with Evaluation
- 📖 Study Materials

---

## 🔷 Architecture

### Core Models
1. **ResourceCategory** → NCERT, PYQ, Mock Tests, Study Material
2. **SubCategory** → Prelims, Mains, Interview
3. **Filter** → Subject, Class, Paper, Year (Dynamic)
4. **Resource** → PDFs, Study Materials
5. **MockTest** → Tests with Questions
6. **Result** → Student Test Results

---

## 🔷 API Endpoints

Base URL: `http://localhost:5000/api/resources`

---

## ✅ 1. Category APIs

### 1.1 Create Category
**POST** `/api/resources/categories`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (form-data):**
```
name: "NCERT Books"
description: "NCERT Books for all classes"
thumbnail: <file> (optional)
```

**Response:**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "_id": "...",
    "name": "NCERT Books",
    "thumbnail": {
      "url": "https://...",
      "public_id": "..."
    },
    "isActive": true
  }
}
```

**Access:** `super_admin`, `center_admin`

---

### 1.2 Get All Categories
**GET** `/api/resources/categories`

**Query Parameters:**
- `isActive` (optional): `true` or `false`

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "name": "NCERT Books",
      "isActive": true
    }
  ]
}
```

**Access:** Public

---

### 1.3 Get Category by ID
**GET** `/api/resources/categories/:id`

**Access:** Public

---

### 1.4 Update Category
**PUT** `/api/resources/categories/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (form-data):**
```
name: "NCERT Books Updated"
description: "Updated description"
thumbnail: <file> (optional)
isActive: true
```

**Access:** `super_admin`, `center_admin`

---

### 1.5 Delete Category
**DELETE** `/api/resources/categories/:id`

**Access:** `super_admin`, `center_admin`

**Note:** Cannot delete if category has subcategories, resources, or mock tests.

---

## ✅ 2. SubCategory APIs

### 2.1 Create SubCategory
**POST** `/api/resources/subcategories`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (form-data):**
```
name: "Prelims"
categoryId: "<category_id>"
description: "Prelims examination"
thumbnail: <file> (optional)
```

**Access:** `super_admin`, `center_admin`

---

### 2.2 Get SubCategories
**GET** `/api/resources/subcategories`

**Query Parameters:**
- `categoryId` (optional): Filter by category
- `isActive` (optional): `true` or `false`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "name": "Prelims",
      "categoryId": {
        "_id": "...",
        "name": "NCERT Books"
      }
    }
  ]
}
```

**Access:** Public

---

### 2.3 Get SubCategories by Category
**GET** `/api/resources/subcategories/category/:categoryId`

**Access:** Public

---

### 2.4 Update SubCategory
**PUT** `/api/resources/subcategories/:id`

**Access:** `super_admin`, `center_admin`

---

### 2.5 Delete SubCategory
**DELETE** `/api/resources/subcategories/:id`

**Access:** `super_admin`, `center_admin`

---

## ✅ 3. Filter APIs

### 3.1 Create Filter
**POST** `/api/resources/filters`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "type": "SUBJECT",
  "value": "History",
  "categoryId": "<category_id>",
  "subCategoryId": "<subcategory_id>" (optional)
}
```

**Filter Types:**
- `SUBJECT` → History, Geography, Polity, etc.
- `CLASS` → 6th, 7th, 8th, 9th, 10th, 11th, 12th
- `PAPER` → CSAT, GS Paper 1, GS Paper 2, Essay, etc.
- `YEAR` → 2020, 2021, 2022, 2023, 2024, 2025

**Access:** `super_admin`, `center_admin`

---

### 3.2 Get All Filters
**GET** `/api/resources/filters`

**Query Parameters:**
- `type` (optional): `SUBJECT`, `CLASS`, `PAPER`, `YEAR`
- `categoryId` (optional): Filter by category
- `subCategoryId` (optional): Filter by subcategory
- `isActive` (optional): `true` or `false`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "type": "SUBJECT",
      "value": "History",
      "categoryId": { ... },
      "subCategoryId": { ... }
    }
  ]
}
```

**Access:** Public

---

### 3.3 Get Filters by Category (Grouped)
**GET** `/api/resources/filters/category/:categoryId`

**Query Parameters:**
- `type` (optional): Filter by type

**Response:**
```json
{
  "success": true,
  "data": {
    "SUBJECT": [
      { "_id": "...", "value": "History" },
      { "_id": "...", "value": "Geography" }
    ],
    "CLASS": [
      { "_id": "...", "value": "10th" },
      { "_id": "...", "value": "11th" }
    ]
  }
}
```

**Access:** Public

---

### 3.4 Update Filter
**PUT** `/api/resources/filters/:id`

**Body:**
```json
{
  "value": "Updated Value",
  "isActive": true
}
```

**Access:** `super_admin`, `center_admin`

---

### 3.5 Delete Filter
**DELETE** `/api/resources/filters/:id`

**Access:** `super_admin`, `center_admin`

---

## ✅ 4. Resource APIs (PDFs, Study Material)

### 4.1 Create Resource
**POST** `/api/resources/files`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (form-data):**
```
title: "NCERT History Class 10"
description: "India and the Contemporary World - II"
categoryId: "<category_id>"
subCategoryId: "<subcategory_id>" (optional)
subject: "History"
class: "10th"
paper: "" (optional)
year: "" (optional)
fileSize: "15 MB"
fileType: "pdf"
file: <pdf_file> (required)
thumbnail: <image_file> (optional)
```

**Response:**
```json
{
  "success": true,
  "message": "Resource created successfully",
  "data": {
    "_id": "...",
    "title": "NCERT History Class 10",
    "fileUrl": {
      "url": "https://res.cloudinary.com/...",
      "public_id": "..."
    },
    "thumbnail": { ... },
    "subject": "History",
    "class": "10th",
    "downloads": 0
  }
}
```

**Access:** `super_admin`, `center_admin`

---

### 4.2 Get Resources (With Filters)
**GET** `/api/resources/files`

**Query Parameters:**
- `categoryId` (required): Category ID
- `subCategoryId` (optional): SubCategory ID
- `subject` (optional): Filter by subject
- `class` (optional): Filter by class
- `paper` (optional): Filter by paper
- `year` (optional): Filter by year
- `isActive` (optional): `true` or `false`

**Examples:**

**Get all NCERT books for History Class 10:**
```
GET /api/resources/files?categoryId=<ncert_id>&subject=History&class=10th
```

**Get PYQ Prelims GS Paper 1 2024:**
```
GET /api/resources/files?categoryId=<pyq_id>&subCategoryId=<prelims_id>&paper=GS Paper 1&year=2024
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "title": "NCERT History Class 10",
      "fileUrl": { ... },
      "subject": "History",
      "class": "10th",
      "downloads": 15
    }
  ]
}
```

**Access:** Public

---

### 4.3 Get Resource by ID
**GET** `/api/resources/files/:id`

**Note:** Increments download count

**Access:** Public

---

### 4.4 Update Resource
**PUT** `/api/resources/files/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (form-data):**
```
title: "Updated Title"
subject: "Geography"
file: <new_pdf_file> (optional)
thumbnail: <new_image> (optional)
```

**Access:** `super_admin`, `center_admin`

---

### 4.5 Delete Resource
**DELETE** `/api/resources/files/:id`

**Access:** `super_admin`, `center_admin`

---

## ✅ 5. Mock Test APIs

### 5.1 Create Mock Test
**POST** `/api/resources/mock-tests`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "History Mock Test 1",
  "description": "Test on Ancient Indian History",
  "categoryId": "<category_id>",
  "subCategoryId": "<subcategory_id>",
  "subject": "History",
  "paper": "GS Paper 1",
  "year": "2025",
  "duration": 120,
  "passingMarks": 60,
  "questions": [
    {
      "question": "Who founded the Maurya Empire?",
      "options": ["Chandragupta Maurya", "Ashoka", "Bindusara", "Bimbisara"],
      "correctAnswer": "Chandragupta Maurya",
      "explanation": "Chandragupta Maurya founded the Maurya Empire in 322 BCE.",
      "marks": 2,
      "negativeMarks": 0.5
    },
    {
      "question": "The Battle of Plassey was fought in?",
      "options": ["1757", "1764", "1857", "1947"],
      "correctAnswer": "1757",
      "marks": 2,
      "negativeMarks": 0.5
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mock test created successfully",
  "data": {
    "_id": "...",
    "title": "History Mock Test 1",
    "totalMarks": 4,
    "duration": 120,
    "questions": [ ... ]
  }
}
```

**Access:** `super_admin`, `center_admin`

---

### 5.2 Get Mock Tests
**GET** `/api/resources/mock-tests`

**Query Parameters:**
- `categoryId` (optional)
- `subCategoryId` (optional)
- `subject` (optional)
- `paper` (optional)
- `year` (optional)
- `isActive` (optional)

**Response:** (Excludes questions)
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "title": "History Mock Test 1",
      "totalMarks": 100,
      "duration": 120,
      "subject": "History"
    }
  ]
}
```

**Access:** Public

---

### 5.3 Get Mock Test by ID
**GET** `/api/resources/mock-tests/:id`

**Query Parameters:**
- `includeQuestions` (optional): 
  - `true` → Returns full test with correct answers (admin)
  - `false` or omitted → Returns test without correct answers (student)

**Student View:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "History Mock Test 1",
    "totalMarks": 100,
    "duration": 120,
    "questions": [
      {
        "_id": "...",
        "question": "Who founded the Maurya Empire?",
        "options": ["Chandragupta Maurya", "Ashoka", "Bindusara", "Bimbisara"],
        "marks": 2
      }
    ]
  }
}
```

**Access:** Public

---

### 5.4 Update Mock Test
**PUT** `/api/resources/mock-tests/:id`

**Access:** `super_admin`, `center_admin`

---

### 5.5 Delete Mock Test
**DELETE** `/api/resources/mock-tests/:id`

**Access:** `super_admin`, `center_admin`

---

## ✅ 6. Test Attempt & Evaluation APIs

### 6.1 Attempt Mock Test
**POST** `/api/resources/mock-tests/attempt`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "testId": "<test_id>",
  "startedAt": "2025-04-17T10:00:00.000Z",
  "timeTaken": 5400,
  "answers": [
    {
      "questionIndex": 0,
      "selectedAnswer": "Chandragupta Maurya"
    },
    {
      "questionIndex": 1,
      "selectedAnswer": "1757"
    },
    {
      "questionIndex": 2,
      "selectedAnswer": ""
    }
  ]
}
```

**Evaluation Logic:**
- Correct answer: `+marks`
- Wrong answer: `-negativeMarks`
- Skipped: `0`

**Response:**
```json
{
  "success": true,
  "message": "Test submitted successfully",
  "data": {
    "score": 85,
    "totalMarks": 100,
    "correctAnswers": 45,
    "wrongAnswers": 10,
    "skippedQuestions": 5,
    "percentage": "85.00",
    "passed": true
  }
}
```

**Access:** `student`, `parent`

---

### 6.2 Get User's Test Results
**GET** `/api/resources/mock-tests/results`

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "testId": {
        "title": "History Mock Test 1",
        "subject": "History"
      },
      "score": 85,
      "totalMarks": 100,
      "percentage": "85.00",
      "passed": true,
      "completedAt": "2025-04-17T11:30:00.000Z"
    }
  ]
}
```

**Access:** `student`, `parent`

---

### 6.3 Get Result by ID
**GET** `/api/resources/mock-tests/results/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "testId": { ... },
    "userId": { ... },
    "answers": [
      {
        "questionIndex": 0,
        "selectedAnswer": "Chandragupta Maurya",
        "isCorrect": true
      }
    ],
    "score": 85,
    "totalMarks": 100,
    "correctAnswers": 45,
    "wrongAnswers": 10,
    "skippedQuestions": 5,
    "percentage": "85.00",
    "passed": true,
    "timeTaken": 5400
  }
}
```

**Access:** `student`, `parent` (own results only), admins (all results)

---

## 🔷 Role-Based Access Control

| Role | Create | Read | Update | Delete |
|------|--------|------|--------|--------|
| `super_admin` | ✅ All | ✅ All | ✅ All | ✅ All |
| `center_admin` | ✅ Own | ✅ Own | ✅ Own | ✅ Own |
| `student` | ❌ | ✅ Public | ❌ | ❌ |
| `parent` | ❌ | ✅ Public | ❌ | ❌ |

---

## 🔷 Setup Workflow

### Step 1: Create Category
```bash
POST /api/resources/categories
{
  "name": "NCERT Books"
}
```

### Step 2: Create SubCategory
```bash
POST /api/resources/subcategories
{
  "name": "Class 10",
  "categoryId": "<ncert_id>"
}
```

### Step 3: Create Filters
```bash
POST /api/resources/filters
[
  { "type": "SUBJECT", "value": "History", "categoryId": "<ncert_id>" },
  { "type": "SUBJECT", "value": "Geography", "categoryId": "<ncert_id>" },
  { "type": "CLASS", "value": "10th", "categoryId": "<ncert_id>" }
]
```

### Step 4: Upload Resources
```bash
POST /api/resources/files
{
  "title": "NCERT History Class 10",
  "categoryId": "<ncert_id>",
  "subject": "History",
  "class": "10th",
  "file": <pdf>
}
```

### Step 5: Create Mock Test
```bash
POST /api/resources/mock-tests
{
  "title": "History Test",
  "categoryId": "<category_id>",
  "questions": [ ... ]
}
```

---

## 🔷 Query Examples

### Get NCERT Books for History Class 10
```
GET /api/resources/files?categoryId=<ncert_id>&subject=History&class=10th
```

### Get PYQ Prelims CSAT 2024
```
GET /api/resources/files?categoryId=<pyq_id>&subCategoryId=<prelims_id>&paper=CSAT&year=2024
```

### Get All Mock Tests for Geography
```
GET /api/resources/mock-tests?subject=Geography
```

---

## 🔷 Key Features

✅ **Fully Dynamic** - No hardcoded subjects, classes, years, or papers
✅ **Reusable Filters** - Create once, use across multiple resources
✅ **Role-Based Access** - Super Admin vs Center Admin separation
✅ **File Upload** - PDF + Thumbnail with Cloudinary integration
✅ **Test Evaluation** - Automatic scoring with negative marking
✅ **Result Tracking** - Complete student performance analytics
✅ **Scalable** - Easy to add new categories and modules

---

## 🔷 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Category with this slug already exists"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role 'student' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error message"
}
```

---

## 🔷 Next Steps

- [ ] Add pagination support
- [ ] Add search functionality
- [ ] Add bookmark/favorite resources
- [ ] Add test leaderboard
- [ ] Add analytics dashboard
- [ ] Add bulk upload (CSV/Excel)
- [ ] Add resource comments/ratings

---

**🎉 Your Free Resources CMS is ready to use!**
