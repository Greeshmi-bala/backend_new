# 📝 Mock Test Creation & Management Guide

Complete guide for creating, managing, and taking mock tests in the Free Resources CMS.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Mock Test Creation](#step-by-step-mock-test-creation)
4. [Adding Questions](#adding-questions)
5. [Managing Mock Tests](#managing-mock-tests)
6. [Taking Mock Tests](#taking-mock-tests)
7. [Viewing Results](#viewing-results)
8. [API Reference](#api-reference)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Mock Tests are interactive assessments that students can take online. Features include:

- ✅ Multiple choice questions with 4 options
- ✅ Custom duration and passing marks
- ✅ Negative marking support
- ✅ Automatic evaluation
- ✅ Detailed results with explanations
- ✅ Category and paper-based organization

---

## 📦 Prerequisites

Before creating a mock test, ensure you have:

1. **Mock Test Category** created
2. **SubCategories** (Prelims/Mains) created
3. **PAPER filters** created (optional but recommended)
4. **Admin access** (`super_admin` or `center_admin`)

---

## 🚀 Step-by-Step Mock Test Creation

### **Step 1: Create Mock Test Category**

```bash
POST /api/resources/categories
Content-Type: multipart/form-data
Authorization: Bearer <admin_token>

name: "Mock Tests"
description: "Practice mock tests for UPSC"
thumbnail: <image_file>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "mock_cat_123",
    "name": "Mock Tests",
    "description": "Practice mock tests for UPSC"
  }
}
```

---

### **Step 2: Create SubCategories**

#### **Create Prelims SubCategory:**
```bash
POST /api/resources/subcategories
Content-Type: multipart/form-data
Authorization: Bearer <admin_token>

name: "Prelims"
categoryId: "mock_cat_123"
description: "Prelims mock tests"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "prelims_sub_456",
    "name": "Prelims",
    "categoryId": "mock_cat_123"
  }
}
```

#### **Create Mains SubCategory:**
```bash
POST /api/resources/subcategories
Content-Type: multipart/form-data
Authorization: Bearer <admin_token>

name: "Mains"
categoryId: "mock_cat_123"
description: "Mains mock tests"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "mains_sub_789",
    "name": "Mains",
    "categoryId": "mock_cat_123"
  }
}
```

---

### **Step 3: Create PAPER Filters (Optional)**

```bash
POST /api/resources/filters
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "type": "PAPER",
  "value": "GS Paper 1",
  "categoryId": "mock_cat_123",
  "subCategoryId": "prelims_sub_456"
}
```

```bash
POST /api/resources/filters
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "type": "PAPER",
  "value": "CSAT",
  "categoryId": "mock_cat_123",
  "subCategoryId": "prelims_sub_456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "gs_paper_filter_001",
    "type": "PAPER",
    "value": "GS Paper 1",
    "categoryId": "mock_cat_123",
    "subCategoryId": "prelims_sub_456"
  }
}
```

---

### **Step 4: Create Mock Test**

```bash
POST /api/resources/mock-tests
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "title": "UPSC Prelims Mock Test 1",
  "description": "Full length mock test for UPSC Prelims preparation",
  "categoryId": "mock_cat_123",
  "subCategoryId": "prelims_sub_456",
  "paperId": "gs_paper_filter_001",
  "duration": 120,
  "passingMarks": 60,
  "questions": [
    {
      "question": "Who founded the Maurya Empire?",
      "options": [
        "Chandragupta Maurya",
        "Ashoka",
        "Bindusara",
        "Bimbisara"
      ],
      "correctAnswer": "Chandragupta Maurya",
      "explanation": "Chandragupta Maurya founded the Maurya Empire in 322 BCE with the help of Chanakya.",
      "marks": 2,
      "negativeMarks": 0.5
    },
    {
      "question": "The Battle of Plassey was fought in which year?",
      "options": [
        "1757",
        "1764",
        "1857",
        "1947"
      ],
      "correctAnswer": "1757",
      "explanation": "The Battle of Plassey was fought on June 23, 1757 between the British East India Company and Siraj-ud-Daulah.",
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
    "_id": "mock_test_001",
    "title": "UPSC Prelims Mock Test 1",
    "description": "Full length mock test for UPSC Prelims preparation",
    "categoryId": "mock_cat_123",
    "subCategoryId": "prelims_sub_456",
    "paperId": "gs_paper_filter_001",
    "duration": 120,
    "passingMarks": 60,
    "totalMarks": 4,
    "questionCount": 2,
    "isActive": true,
    "createdAt": "2026-04-17T10:30:00.000Z",
    "updatedAt": "2026-04-17T10:30:00.000Z"
  }
}
```

---

## ❓ Adding Questions

### **Question Structure:**

```json
{
  "question": "Question text here?",
  "options": [
    "Option A",
    "Option B",
    "Option C",
    "Option D"
  ],
  "correctAnswer": "Option A",
  "explanation": "Detailed explanation of why Option A is correct",
  "marks": 2,
  "negativeMarks": 0.5
}
```

### **Question Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `question` | String | ✅ Yes | The question text |
| `options` | Array | ✅ Yes | Array of 4 options |
| `correctAnswer` | String | ✅ Yes | Must match one of the options exactly |
| `explanation` | String | ❌ No | Explanation shown after test submission |
| `marks` | Number | ✅ Yes | Marks for correct answer |
| `negativeMarks` | Number | ❌ No | Marks deducted for wrong answer |

---

## 📊 Managing Mock Tests

### **1. Get All Mock Tests**

```bash
GET /api/resources/mock-tests?categoryId=mock_cat_123&page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `categoryId` - Filter by category
- `subCategoryId` - Filter by subcategory
- `paperId` - Filter by paper
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - asc or desc (default: desc)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "hasNextPage": true,
  "hasPrevPage": false,
  "data": [
    {
      "_id": "mock_test_001",
      "title": "UPSC Prelims Mock Test 1",
      "description": "Full length mock test",
      "categoryId": {
        "_id": "mock_cat_123",
        "name": "Mock Tests"
      },
      "subCategoryId": {
        "_id": "prelims_sub_456",
        "name": "Prelims"
      },
      "duration": 120,
      "passingMarks": 60,
      "totalMarks": 200,
      "questionCount": 100,
      "isActive": true
    }
  ]
}
```

---

### **2. Get Mock Test by ID**

```bash
GET /api/resources/mock-tests/mock_test_001?includeQuestions=true
Authorization: Bearer <token>
```

**Query Parameters:**
- `includeQuestions` - Set to `true` to include questions (default: false)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "mock_test_001",
    "title": "UPSC Prelims Mock Test 1",
    "description": "Full length mock test",
    "duration": 120,
    "passingMarks": 60,
    "totalMarks": 200,
    "questionCount": 100,
    "questions": [
      {
        "_id": "q1",
        "question": "Who founded the Maurya Empire?",
        "options": ["Chandragupta Maurya", "Ashoka", "Bindusara", "Bimbisara"],
        "marks": 2,
        "negativeMarks": 0.5
      }
    ],
    "isActive": true
  }
}
```

---

### **3. Update Mock Test**

```bash
PUT /api/resources/mock-tests/mock_test_001
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "title": "UPSC Prelims Mock Test 1 (Updated)",
  "description": "Updated description",
  "duration": 150,
  "passingMarks": 65
}
```

---

### **4. Delete Mock Test**

```bash
DELETE /api/resources/mock-tests/mock_test_001
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Mock test deleted successfully"
}
```

---

## 🎓 Taking Mock Tests

### **1. Submit Mock Test**

```bash
POST /api/resources/mock-tests/mock_test_001/submit
Content-Type: application/json
Authorization: Bearer <student_token>

{
  "answers": {
    "question_id_1": "Chandragupta Maurya",
    "question_id_2": "1757",
    "question_id_3": "Option C"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Test submitted successfully",
  "data": {
    "resultId": "result_001",
    "testId": "mock_test_001",
    "totalQuestions": 100,
    "attemptedQuestions": 95,
    "correctAnswers": 70,
    "wrongAnswers": 25,
    "skippedQuestions": 5,
    "marksObtained": 127.5,
    "totalMarks": 200,
    "percentage": 63.75,
    "passed": true,
    "timeTaken": 7200
  }
}
```

---

## 📈 Viewing Results

### **1. Get All My Results**

```bash
GET /api/resources/mock-tests/results/my-results
Authorization: Bearer <student_token>
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "result_001",
      "testId": {
        "_id": "mock_test_001",
        "title": "UPSC Prelims Mock Test 1",
        "paper": "GS Paper 1"
      },
      "marksObtained": 127.5,
      "totalMarks": 200,
      "percentage": 63.75,
      "passed": true,
      "completedAt": "2026-04-17T11:00:00.000Z"
    }
  ]
}
```

---

### **2. Get Result by ID**

```bash
GET /api/resources/mock-tests/results/result_001
Authorization: Bearer <student_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "result_001",
    "testId": {
      "title": "UPSC Prelims Mock Test 1",
      "questions": [
        {
          "_id": "q1",
          "question": "Who founded the Maurya Empire?",
          "options": ["Chandragupta Maurya", "Ashoka", "Bindusara", "Bimbisara"],
          "correctAnswer": "Chandragupta Maurya",
          "explanation": "Chandragupta Maurya founded..."
        }
      ]
    },
    "answers": {
      "q1": "Chandragupta Maurya"
    },
    "marksObtained": 127.5,
    "totalMarks": 200,
    "percentage": 63.75,
    "correctAnswers": 70,
    "wrongAnswers": 25,
    "skippedQuestions": 5,
    "passed": true
  }
}
```

---

## 📚 API Reference

### **Mock Test Endpoints:**

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/resources/mock-tests` | Admin | Create mock test |
| GET | `/api/resources/mock-tests` | Public | List mock tests (paginated) |
| GET | `/api/resources/mock-tests/:id` | Public | Get mock test details |
| PUT | `/api/resources/mock-tests/:id` | Admin | Update mock test |
| DELETE | `/api/resources/mock-tests/:id` | Admin | Delete mock test |
| POST | `/api/resources/mock-tests/:id/submit` | Student | Submit test answers |
| GET | `/api/resources/mock-tests/results/my-results` | Student | Get user's results |
| GET | `/api/resources/mock-tests/results/:id` | Student | Get specific result |

---

## ✅ Best Practices

### **1. Question Quality:**
- ✅ Write clear, unambiguous questions
- ✅ Provide detailed explanations
- ✅ Use appropriate marking scheme (UPSC: +2 for correct, -0.67 for wrong)
- ✅ Keep options realistic and plausible

### **2. Test Structure:**
- ✅ Prelims: 100 questions, 2 hours (GS) + 80 questions, 2 hours (CSAT)
- ✅ Set passing marks appropriately (usually 33% for CSAT, cutoff-based for GS)
- ✅ Organize tests by paper and difficulty level

### **3. Content Organization:**
```
Mock Tests Category
├── Prelims
│   ├── GS Paper 1 Mock Tests
│   │   ├── Mock Test 1
│   │   ├── Mock Test 2
│   │   └── Mock Test 3
│   └── CSAT Mock Tests
│       ├── Mock Test 1
│       └── Mock Test 2
└── Mains
    ├── Essay Mock Tests
    ├── GS Paper 1 Mock Tests
    ├── GS Paper 2 Mock Tests
    ├── GS Paper 3 Mock Tests
    └── GS Paper 4 Mock Tests
```

### **4. Naming Convention:**
- ✅ "UPSC Prelims Mock Test 1 - GS Paper 1"
- ✅ "UPSC Mains Mock Test 3 - GS Paper 2"
- ✅ "CSAT Practice Test 5"

---

## 🔧 Troubleshooting

### **Issue 1: "Filter already exists" Error**

**Problem:** Trying to create duplicate PAPER filter

**Solution:** Check existing filters first:
```bash
GET /api/resources/filters?type=PAPER&categoryId=mock_cat_123
```

Use existing filter IDs or create with different subCategoryId.

---

### **Issue 2: "Cannot destructure property 'type' of 'req.body'"**

**Problem:** Wrong Content-Type header

**Solution:** Use `application/json` for mock test creation, NOT `multipart/form-data`

---

### **Issue 3: Mock test not showing in list**

**Problem:** Mock test is inactive or not properly created

**Solution:**
1. Check if `isActive: true`
2. Verify categoryId and subCategoryId are correct
3. Query without filters: `GET /api/resources/mock-tests`

---

### **Issue 4: Student can't submit test**

**Problem:** Authentication or test not active

**Solution:**
1. Ensure student is logged in with valid token
2. Check if mock test `isActive: true`
3. Verify answers format matches question IDs

---

## 📊 Example: Complete Mock Test Creation Workflow

```bash
# Step 1: Create Category
POST /api/resources/categories
→ Returns: mock_cat_123

# Step 2: Create SubCategory
POST /api/resources/subcategories
→ Returns: prelims_sub_456

# Step 3: Create PAPER Filter
POST /api/resources/filters
→ Returns: gs_paper_filter_001

# Step 4: Create Mock Test
POST /api/resources/mock-tests
{
  "categoryId": "mock_cat_123",
  "subCategoryId": "prelims_sub_456",
  "paperId": "gs_paper_filter_001",
  "title": "UPSC Prelims Mock Test 1",
  "duration": 120,
  "passingMarks": 60,
  "questions": [/* 100 questions */]
}
→ Returns: mock_test_001

# Step 5: Student Takes Test
POST /api/resources/mock-tests/mock_test_001/submit
{
  "answers": { /* student answers */ }
}
→ Returns: result with score

# Step 6: Student Views Result
GET /api/resources/mock-tests/results/my-results
→ Returns: all test results
```

---

## 🎉 Summary

Mock Tests provide an interactive way for students to:
- ✅ Practice with real exam-like questions
- ✅ Get instant results and feedback
- ✅ Track progress over time
- ✅ Identify weak areas

Admins can:
- ✅ Create unlimited mock tests
- ✅ Organize by category, subcategory, and paper
- ✅ Set custom duration and marking scheme
- ✅ Monitor student performance

---

**🚀 Ready to create engaging mock tests for your students!**
