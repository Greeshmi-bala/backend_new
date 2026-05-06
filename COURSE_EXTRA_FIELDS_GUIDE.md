# 📦 Course Extra Fields Guide

## What is `extraFields`?

`extraFields` is a **flexible, category-specific data field** that allows you to store custom information for different course types.

---

## ✅ Purpose

Different course categories need different information:
- **Mentorship** → Common dilemmas, phases, features
- **Test Series** → Test structure, evaluation features
- **Optional Subject** → Subject details, syllabus info
- **GS Foundation** → May not need extra fields

Instead of creating separate models for each category, `extraFields` stores **any JSON data** you need!

---

## 📝 How to Use

### Basic Structure

```javascript
extraFields: {
  // Any key-value pairs you need
  "key1": "value1",
  "key2": ["item1", "item2"],
  "key3": {
    "nestedKey": "nestedValue"
  }
}
```

---

## 🎯 Examples by Category

### 1️⃣ **Mentorship Course**

```json
{
  "commonDilemmas": [
    "When to start answer writing practice?",
    "How to balance prelims and mains preparation?",
    "Which optional subject to choose?",
    "How to manage time effectively?"
  ],
  "programPhases": [
    "Phase 1: Foundation - Concept building and NCERT completion",
    "Phase 2: Practice - Answer writing and test series",
    "Phase 3: Revision - Intensive mock tests and current affairs"
  ],
  "mentorshipFeatures": [
    "Weekly 1-on-1 sessions with mentor",
    "Personalized study plan based on your strengths",
    "Monthly progress assessment",
    "Dedicated doubt clearing sessions",
    "Access to exclusive study material"
  ]
}
```

---

### 2️⃣ **Test Series Course**

```json
{
  "testStructure": [
    "25 sectional tests",
    "12 subject-wise tests",
    "8 full-length mock tests",
    "5 previous year papers"
  ],
  "evaluationFeatures": [
    "Detailed performance analysis",
    "Model answers provided",
    "Mentor feedback on each test",
    "All India ranking",
    "Performance trends and analytics"
  ],
  "testSchedule": {
    "startDate": "2026-06-01",
    "endDate": "2026-12-31",
    "frequency": "Weekly"
  }
}
```

---

### 3️⃣ **Optional Subject Course**

```json
{
  "subjectDetails": {
    "subjectName": "Geography",
    "paperType": "Optional (Paper 1 & 2)",
    "syllabusCoverage": "Complete UPSC syllabus"
  },
  "topics": [
    "Physical Geography",
    "Human Geography",
    "Indian Geography",
    "World Geography",
    "Geographical Thinkers"
  ],
  "facultyInfo": {
    "name": "Dr. Sharma",
    "experience": "15+ years",
    "qualifications": "PhD in Geography"
  }
}
```

---

### 4️⃣ **GS Foundation Course** (Optional - Can be empty)

```json
{}
```

OR

```json
{
  "batchSize": "30 students",
  "classSchedule": "Monday to Friday",
  "studyMaterial": "Self-prepared notes + NCERT guidance"
}
```

---

## 🔧 How to Send in API

### Using JavaScript (Frontend)

```javascript
const formData = new FormData();

// ... other fields ...

// Add extraFields as JSON string
formData.append('extraFields', JSON.stringify({
  commonDilemmas: [
    "When to start answer writing practice?",
    "How to balance prelims and mains?"
  ],
  programPhases: [
    "Phase 1: Foundation",
    "Phase 2: Practice"
  ],
  mentorshipFeatures: [
    "1-on-1 mentorship",
    "Weekly reviews"
  ]
}));

// Send request
await fetch('http://localhost:5000/api/courses', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

---

### Using Postman

| Key | Value | Type |
|-----|-------|------|
| `extraFields` | `{"commonDilemmas":["When to start?","How to balance?"],"programPhases":["Phase 1","Phase 2"]}` | Text |

**⚠️ Important:** 
- Set Type to **Text** (not File)
- Value must be a **valid JSON string**
- No need to add if not required

---

### Using cURL

```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=UPSC Mentorship" \
  -F "center=CENTER_ID" \
  -F "category=CATEGORY_ID" \
  -F 'extraFields={"commonDilemmas":["When to start?"],"programPhases":["Phase 1"],"mentorshipFeatures":["1-on-1 sessions"]}' \
  -F "banner=@banner.jpg"
```

---

## 📊 Response Format

### When Creating Course

```json
{
  "success": true,
  "message": "Course created successfully",
  "course": {
    "_id": "...",
    "title": "UPSC Mentorship Program",
    "center": { "name": "New Delhi" },
    "category": { "name": "Mentorship" },
    "extraFields": {
      "commonDilemmas": [
        "When to start answer writing practice?",
        "How to balance prelims and mains?"
      ],
      "programPhases": [
        "Phase 1: Foundation",
        "Phase 2: Practice"
      ],
      "mentorshipFeatures": [
        "1-on-1 mentorship",
        "Weekly reviews"
      ]
    },
    // ... other fields
  }
}
```

---

## ✅ Best Practices

### 1. **Use Descriptive Keys**
```javascript
// ✅ Good
{
  "mentorshipFeatures": ["Feature 1", "Feature 2"],
  "programPhases": ["Phase 1", "Phase 2"]
}

// ❌ Bad
{
  "data1": ["Feature 1"],
  "info": ["Phase 1"]
}
```

### 2. **Keep Structure Consistent**
```javascript
// Use arrays for lists
{
  "features": ["Feature 1", "Feature 2"],
  "phases": ["Phase 1", "Phase 2"]
}

// Use objects for grouped data
{
  "schedule": {
    "startDate": "2026-06-01",
    "endDate": "2026-12-31"
  }
}
```

### 3. **Optional Field**
```javascript
// If not needed, send empty object or skip entirely
formData.append('extraFields', JSON.stringify({}));
// OR just don't include it
```

### 4. **Frontend Rendering Example**

```jsx
function CourseDetails({ course }) {
  const { extraFields } = course;

  return (
    <div>
      {/* Render common dilemmas */}
      {extraFields.commonDilemmas && (
        <section>
          <h3>Common Dilemmas We Solve</h3>
          <ul>
            {extraFields.commonDilemmas.map((dilemma, index) => (
              <li key={index}>{dilemma}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Render program phases */}
      {extraFields.programPhases && (
        <section>
          <h3>Program Phases</h3>
          {extraFields.programPhases.map((phase, index) => (
            <div key={index}>
              <h4>{phase}</h4>
            </div>
          ))}
        </section>
      )}

      {/* Render mentorship features */}
      {extraFields.mentorshipFeatures && (
        <section>
          <h3>Features</h3>
          <ul>
            {extraFields.mentorshipFeatures.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
```

---

## 🔑 Key Points

| Feature | Details |
|---------|---------|
| **Required?** | ❌ No (Optional) |
| **Data Type** | Mixed (Any JSON) |
| **Default Value** | `{}` (Empty object) |
| **Format in API** | JSON string (must use `JSON.stringify()`) |
| **Database Storage** | Flexible JSON object |
| **Frontend Access** | `course.extraFields.yourKey` |

---

## 🎯 When to Use

✅ **Use `extraFields` when:**
- Category needs custom data not in main schema
- Different categories have different requirements
- You want flexibility without schema changes
- Adding category-specific features

❌ **Don't use `extraFields` when:**
- Data is common to all categories (use regular fields)
- Data needs validation (use schema fields)
- Data is frequently queried/filtered (use indexed fields)

---

## 📝 Quick Reference

### Minimal Example
```json
{}
```

### Simple Example
```json
{
  "batchSize": "30 students",
  "duration": "1 Year"
}
```

### Complex Example
```json
{
  "commonDilemmas": ["Question 1", "Question 2"],
  "programPhases": ["Phase 1", "Phase 2", "Phase 3"],
  "features": ["Feature 1", "Feature 2"],
  "schedule": {
    "startDate": "2026-06-01",
    "frequency": "Daily"
  },
  "pricing": {
    "earlyBird": 45000,
    "regular": 50000
  }
}
```

---

## 🚀 Summary

- **`extraFields`** = Flexible storage for category-specific data
- **Format** = Any valid JSON object
- **Send as** = JSON string in FormData
- **Optional** = Can be empty `{}` or omitted
- **Purpose** = Avoid schema changes for custom category data

**Use it to make your courses dynamic and category-specific!** 🎓
