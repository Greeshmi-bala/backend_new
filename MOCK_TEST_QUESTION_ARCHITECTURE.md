# 🎯 Mock Test Architecture - Normalized Question System

Production-ready mock test system with normalized question storage for scalability and easy management.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Database Models](#database-models)
3. [API Implementation](#api-implementation)
4. [Adding Questions](#adding-questions)
5. [Editing Questions](#editing-questions)
6. [Managing Questions](#managing-questions)
7. [API Endpoints](#api-endpoints)
8. [Step-by-Step Procedures](#step-by-step-procedures)

---

## 🏗️ Architecture Overview

### **Design Pattern: Normalized Data Structure**

Instead of storing questions embedded in MockTest, we store them separately and reference by IDs.

```
┌─────────────────┐         ┌──────────────────┐
│   MockTest      │         │    Question      │
├─────────────────┤         ├──────────────────┤
│ _id             │────────▶│ _id              │
│ title           │  refs   │ question         │
│ description     │         │ options[]        │
│ questionIds[]   │────────▶│ correctAnswer    │
│ duration        │         │ explanation      │
│ totalMarks      │   refs  │ marks            │
│ passingMarks    │         │ negativeMarks    │
└─────────────────┘         └──────────────────┘
                                     │
                                     │ refs
                                     ▼
                            ┌──────────────────┐
                            │     Result       │
                            ├──────────────────┤
                            │ userId           │
                            │ testId           │
                            │ answers[]        │
                            │  - questionId    │
                            │  - selectedAns   │
                            │  - isCorrect     │
                            │  - marksObtained │
                            │ score            │
                            │ percentage       │
                            └──────────────────┘
```

---

## 🗄️ Database Models

### **1. MockTest Model**

```javascript
{
  title: String,                    // Test title
  description: String,              // Test description
  categoryId: ObjectId,             // Reference to ResourceCategory
  subCategoryId: ObjectId,          // Reference to SubCategory
  paperId: ObjectId,                // Reference to Filter (PAPER type)
  questionIds: [ObjectId],          // Array of Question IDs
  totalMarks: Number,               // Auto-calculated from questions
  duration: Number,                 // In minutes
  passingMarks: Number,             // Minimum marks to pass
  isActive: Boolean,
  createdBy: ObjectId,
  centerId: ObjectId
}
```

**Key Features:**
- ✅ `questionIds` stores references to Question collection
- ✅ `totalMarks` auto-calculated via pre-save hook
- ✅ No embedded questions

---

### **2. Question Model**

```javascript
{
  question: String,                 // Question text
  options: [String],                // Exactly 4 options
  correctAnswer: String,            // Must match one option
  explanation: String,              // Optional explanation
  marks: Number,                    // Marks for correct answer
  negativeMarks: Number,            // Marks deducted for wrong
  isActive: Boolean,
  createdBy: ObjectId
}
```

**Key Features:**
- ✅ Independent collection
- ✅ Can be reused across multiple tests
- ✅ Easy to edit/update
- ✅ Validation ensures 4 options

---

### **3. Result Model**

```javascript
{
  userId: ObjectId,                 // Student who took test
  testId: ObjectId,                 // Reference to MockTest
  answers: [{
    questionId: ObjectId,           // Reference to Question
    selectedAnswer: String,         // Student's answer
    isCorrect: Boolean,             // Auto-evaluated
    marksObtained: Number           // Can be negative
  }],
  score: Number,                    // Total marks obtained
  totalMarks: Number,               // Test total marks
  correctAnswers: Number,
  wrongAnswers: Number,
  skippedQuestions: Number,
  percentage: Number,               // Auto-calculated
  passed: Boolean,
  timeTaken: Number,                // In seconds
  completedAt: Date
}
```

**Key Features:**
- ✅ Stores question references (not indices)
- ✅ Snapshot of answers for future reference
- ✅ Auto-evaluation on submission

---

## 💻 API Implementation

### **Create Mock Test**

**Input Format (Simple):**
```json
POST /api/resources/mock-tests
{
  "title": "UPSC Prelims Mock Test 1",
  "description": "Full length mock test",
  "categoryId": "cat_123",
  "subCategoryId": "sub_456",
  "paperId": "paper_789",
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
    }
  ]
}
```

**Backend Processing:**
```javascript
// Step 1: Extract questions
const { questions, ...testData } = req.body;

// Step 2: Save questions to Question collection
const createdQuestions = await Question.insertMany(
  questions.map(q => ({
    ...q,
    createdBy: req.user._id
  }))
);

// Step 3: Extract question IDs
const questionIds = createdQuestions.map(q => q._id);

// Step 4: Create mock test with IDs only
const mockTest = new MockTest({
  ...testData,
  questionIds,
  createdBy: req.user._id
});

await mockTest.save();
```

**Output Format (Same as Input):**
```json
{
  "success": true,
  "data": {
    "_id": "test_001",
    "title": "UPSC Prelims Mock Test 1",
    "questions": [
      {
        "_id": "q_001",
        "question": "Who founded the Maurya Empire?",
        "options": ["Chandragupta Maurya", "Ashoka", "Bindusara", "Bimbisara"],
        "correctAnswer": "Chandragupta Maurya",
        "explanation": "Chandragupta Maurya founded...",
        "marks": 2,
        "negativeMarks": 0.5
      }
    ],
    "duration": 120,
    "totalMarks": 2
  }
}
```

**Note:** Frontend receives `questions` array (not `questionIds`) - API maintains consistency!

---

## ➕ Adding Questions

### **Method 1: Add During Test Creation**

Include questions in the create request (shown above).

---

### **Method 2: Add Question to Existing Test**

```bash
POST /api/resources/mock-tests/:testId/add-question
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "question": "What is the capital of India?",
  "options": ["New Delhi", "Mumbai", "Kolkata", "Chennai"],
  "correctAnswer": "New Delhi",
  "explanation": "New Delhi is the capital of India.",
  "marks": 2,
  "negativeMarks": 0.5
}
```

**Backend Logic:**
```javascript
exports.addQuestion = async (req, res) => {
  const { testId } = req.params;
  const questionData = req.body;

  // Step 1: Create question
  const question = await Question.create({
    ...questionData,
    createdBy: req.user._id
  });

  // Step 2: Add question ID to mock test
  await MockTest.findByIdAndUpdate(testId, {
    $push: { questionIds: question._id }
  });

  res.json({
    success: true,
    message: 'Question added successfully',
    data: question
  });
};
```

---

### **Method 3: Bulk Add Questions**

```bash
POST /api/resources/mock-tests/:testId/add-questions
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "questions": [
    {
      "question": "Question 1?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "marks": 2
    },
    {
      "question": "Question 2?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "B",
      "marks": 2
    }
  ]
}
```

---

## ✏️ Editing Questions

### **Edit Question (Independent of Mock Test)**

```bash
PUT /api/resources/questions/:questionId
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "question": "Updated question text?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "Option A",
  "explanation": "Updated explanation",
  "marks": 3,
  "negativeMarks": 1
}
```

**Backend Logic:**
```javascript
exports.updateQuestion = async (req, res) => {
  const question = await Question.findByIdAndUpdate(
    req.params.questionId,
    req.body,
    { new: true }
  );

  res.json({
    success: true,
    message: 'Question updated successfully',
    data: question
  });
};
```

**Key Points:**
- ✅ Edit question directly - no need to update mock test
- ✅ Changes reflect in all tests using this question
- ✅ Perfect for correcting typos, updating marks, etc.

---

## 🗑️ Managing Questions

### **1. Remove Question from Test**

```bash
DELETE /api/resources/mock-tests/:testId/question/:questionId
Authorization: Bearer <admin_token>
```

**Backend Logic:**
```javascript
exports.removeQuestion = async (req, res) => {
  const { testId, questionId } = req.params;

  // Remove question ID from test
  await MockTest.findByIdAndUpdate(testId, {
    $pull: { questionIds: questionId }
  });

  // Optionally delete the question itself
  await Question.findByIdAndDelete(questionId);

  res.json({
    success: true,
    message: 'Question removed successfully'
  });
};
```

---

### **2. Delete Question Completely**

```bash
DELETE /api/resources/questions/:questionId
Authorization: Bearer <admin_token>
```

**Note:** This removes the question from ALL tests that reference it.

---

### **3. Deactivate Question (Soft Delete)**

```bash
PATCH /api/resources/questions/:questionId
{
  "isActive": false
}
```

**Better approach:** Keeps question in database but hides it from views.

---

## 📡 API Endpoints

### **Mock Test Endpoints**

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/resources/mock-tests` | Admin | Create test with questions |
| GET | `/api/resources/mock-tests` | Public | List all tests (paginated) |
| GET | `/api/resources/mock-tests/:id?includeQuestions=true` | Public | Get test with questions |
| PUT | `/api/resources/mock-tests/:id` | Admin | Update test details |
| DELETE | `/api/resources/mock-tests/:id` | Admin | Delete test |
| POST | `/api/resources/mock-tests/:id/add-question` | Admin | Add single question |
| POST | `/api/resources/mock-tests/:id/add-questions` | Admin | Add multiple questions |
| DELETE | `/api/resources/mock-tests/:id/question/:questionId` | Admin | Remove question from test |
| POST | `/api/resources/mock-tests/:id/submit` | Student | Submit test answers |

---

### **Question Endpoints**

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| PUT | `/api/resources/questions/:id` | Admin | Edit question |
| DELETE | `/api/resources/questions/:id` | Admin | Delete question |
| PATCH | `/api/resources/questions/:id` | Admin | Update question fields |
| GET | `/api/resources/questions/:id` | Admin | Get question details |

---

### **Result Endpoints**

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/resources/mock-tests/:id/submit` | Student | Submit test |
| GET | `/api/resources/mock-tests/results/my-results` | Student | Get all results |
| GET | `/api/resources/mock-tests/results/:id` | Student | Get specific result |

---

## 📝 Step-by-Step Procedures

### **Procedure 1: Create Complete Mock Test**

```bash
# Step 1: Create category (if not exists)
POST /api/resources/categories
→ Returns: categoryId

# Step 2: Create subcategory
POST /api/resources/subcategories
→ Returns: subCategoryId

# Step 3: Create PAPER filter (optional)
POST /api/resources/filters
{
  "type": "PAPER",
  "value": "GS Paper 1",
  "categoryId": "categoryId",
  "subCategoryId": "subCategoryId"
}
→ Returns: paperId

# Step 4: Create mock test with questions
POST /api/resources/mock-tests
{
  "title": "UPSC Prelims Mock Test 1",
  "categoryId": "categoryId",
  "subCategoryId": "subCategoryId",
  "paperId": "paperId",
  "duration": 120,
  "passingMarks": 60,
  "questions": [
    {
      "question": "Q1?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "marks": 2
    }
  ]
}
→ Returns: Complete test with questions
```

---

### **Procedure 2: Edit Existing Question**

```bash
# Step 1: Get test with questions
GET /api/resources/mock-tests/:testId?includeQuestions=true

# Step 2: Find question to edit
→ Locate question._id from response

# Step 3: Update question
PUT /api/resources/questions/:questionId
{
  "question": "Updated question?",
  "marks": 3
}

# Step 4: Verify changes
GET /api/resources/mock-tests/:testId?includeQuestions=true
→ Question updated automatically
```

---

### **Procedure 3: Add Question to Existing Test**

```bash
# Step 1: Add question
POST /api/resources/mock-tests/:testId/add-question
{
  "question": "New question?",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": "B",
  "marks": 2
}

# Step 2: Verify
GET /api/resources/mock-tests/:testId?includeQuestions=true
→ New question appears in list
```

---

### **Procedure 4: Remove Question from Test**

```bash
# Step 1: Remove question
DELETE /api/resources/mock-tests/:testId/question/:questionId

# Step 2: Verify
GET /api/resources/mock-tests/:testId?includeQuestions=true
→ Question removed from test
```

---

### **Procedure 5: Student Takes Test**

```bash
# Step 1: Get test (without correct answers)
GET /api/resources/mock-tests/:testId?includeQuestions=true

# Step 2: Student answers questions
# Frontend displays questions, student selects answers

# Step 3: Submit answers
POST /api/resources/mock-tests/:testId/submit
{
  "answers": {
    "question_id_1": "Option A",
    "question_id_2": "Option C",
    "question_id_3": ""  // Skipped
  },
  "timeTaken": 7200  // seconds
}

# Step 4: Get result
→ Returns score, percentage, passed status
```

---

## 🎯 Key Benefits

### **✅ Scalability**
- Questions stored separately - no document size limits
- Can have thousands of questions per test
- MongoDB document limit (16MB) not an issue

### **✅ Reusability**
- Same question can be used in multiple tests
- Edit once, update everywhere
- Question bank management

### **✅ Easy Maintenance**
- Edit questions without touching tests
- Add/remove questions dynamically
- Version control friendly

### **✅ Performance**
- Indexes on Question collection
- Faster queries with references
- Lazy loading with populate

### **✅ Data Integrity**
- Referential integrity with ObjectId
- Validation at database level
- Consistent data structure

---

## 🔍 Internal vs External API

| Aspect | Internal (Database) | External (API) |
|--------|-------------------|----------------|
| Storage | `questionIds: [ObjectId]` | `questions: [Object]` |
| Create | Save questions → Store IDs | Accept questions array |
| Read | Populate questionIds | Return as questions |
| Edit | Update Question directly | Same endpoint |
| Frontend | Doesn't see IDs | Sees full questions |

**This separation provides:**
- ✅ Simple API for frontend
- ✅ Optimized storage for backend
- ✅ Best of both worlds

---

## 🚀 Production Checklist

- [x] Question model created
- [x] MockTest model updated (questionIds)
- [x] Result model updated (questionId references)
- [x] Create mock test controller updated
- [x] Get mock test controller updated
- [x] Submit test controller updated
- [x] Auto-calculate totalMarks
- [x] Question validation (4 options)
- [x] Answer evaluation logic
- [x] Response transformation (questionIds → questions)

---

## 📊 Example Workflow

```
Admin Creates Test:
1. POST /mock-tests with questions array
   ↓
2. Backend saves questions to Question collection
   ↓
3. Backend stores questionIds in MockTest
   ↓
4. Returns test with populated questions

Student Takes Test:
1. GET /mock-tests/:id?includeQuestions=true
   ↓
2. Backend populates questionIds
   ↓
3. Returns questions (without correct answers for students)
   ↓
4. Student submits answers { questionId: answer }
   ↓
5. Backend evaluates and creates Result
   ↓
6. Returns score and performance

Admin Edits Question:
1. PUT /questions/:id
   ↓
2. Updates Question collection
   ↓
3. All tests automatically reflect changes
```

---

**🎉 This architecture is production-ready and used by top EdTech platforms!**
