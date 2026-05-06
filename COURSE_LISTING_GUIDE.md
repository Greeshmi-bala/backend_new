# 🎓 Course Listing & Filtering Guide

Complete guide for implementing the course listing page with center/category filtering.

---

## 📋 Table of Contents

1. [API Endpoints](#api-endpoints)
2. [Default Behavior](#default-behavior)
3. [Frontend Implementation](#frontend-implementation)
4. [Course Details Page](#course-details-page)
5. [Examples](#examples)

---

## 🔌 API Endpoints

### 1. Get All Centers (Public)
```bash
GET http://localhost:5000/api/centers
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "centers": [
    { "_id": "...", "name": "New Delhi" },
    { "_id": "...", "name": "Jaipur" },
    { "_id": "...", "name": "Lucknow" }
  ]
}
```

---

### 2. Get All Categories (Public)
```bash
GET http://localhost:5000/api/categories
```

**Response:**
```json
{
  "success": true,
  "count": 6,
  "categories": [
    { "_id": "...", "name": "GS Foundation", "categoryType": "gs_foundation" },
    { "_id": "...", "name": "Mentorship", "categoryType": "mentorship" },
    { "_id": "...", "name": "Optional", "categoryType": "optional" },
    { "_id": "...", "name": "Test Series", "categoryType": "test_series" },
    { "_id": "...", "name": "CSAT", "categoryType": "csat" },
    { "_id": "...", "name": "Enrichment", "categoryType": "enrichment" }
  ]
}
```

---

### 3. Get Courses with Filtering (Public)
```bash
GET http://localhost:5000/api/courses
GET http://localhost:5000/api/courses?centerName=New Delhi&categoryName=GS Foundation
GET http://localhost:5000/api/courses?centerName=Jaipur&categoryName=All
```

**Query Parameters:**
- `centerName` - Filter by center name (optional, default: "New Delhi")
- `categoryName` - Filter by category name (optional, default: "GS Foundation", or "All")
- `limit` - Number of courses to return (optional, default: "all")
- `page` - Page number for pagination (optional)

---

### 4. Get Course by Slug (Public)
```bash
GET http://localhost:5000/api/courses/slug/:slug
```

---

## 🎯 Default Behavior

When no filters are provided:
- **Center:** Defaults to "New Delhi"
- **Category:** Defaults to "GS Foundation"

This ensures the page always shows relevant courses on initial load.

---

## 💻 Frontend Implementation

### React Example (Complete)

```javascript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CourseListing = () => {
  const navigate = useNavigate();
  
  // State management
  const [centers, setCenters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState('New Delhi');
  const [selectedCategory, setSelectedCategory] = useState('GS Foundation');
  const [loading, setLoading] = useState(true);

  // Fetch centers and categories on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [centersRes, categoriesRes] = await Promise.all([
          fetch('/api/centers'),
          fetch('/api/categories')
        ]);
        
        const centersData = await centersRes.json();
        const categoriesData = await categoriesRes.json();
        
        setCenters(centersData.centers);
        setCategories(categoriesData.categories);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    
    fetchInitialData();
  }, []);

  // Fetch courses when filters change
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        let url = `/api/courses?centerName=${selectedCenter}`;
        
        if (selectedCategory !== 'All') {
          url += `&categoryName=${selectedCategory}`;
        }
        
        const res = await fetch(url);
        const data = await res.json();
        setCourses(data.courses || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, [selectedCenter, selectedCategory]);

  // Handle center selection
  const handleCenterClick = (centerName) => {
    setSelectedCenter(centerName);
  };

  // Handle category selection
  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  // Navigate to course details
  const handleCourseClick = (slug) => {
    navigate(`/course/${slug}`);
  };

  return (
    <div className="course-listing-page">
      {/* LEFT SIDEBAR - Centers */}
      <aside className="centers-sidebar">
        <h2>Centers</h2>
        <ul>
          {centers.map((center) => (
            <li
              key={center._id}
              className={selectedCenter === center.name ? 'active' : ''}
              onClick={() => handleCenterClick(center.name)}
            >
              {center.name}
            </li>
          ))}
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* TOP - Categories */}
        <div className="categories-tabs">
          <button
            className={selectedCategory === 'All' ? 'active-tab' : ''}
            onClick={() => handleCategoryClick('All')}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              className={selectedCategory === cat.name ? 'active-tab' : ''}
              onClick={() => handleCategoryClick(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* RIGHT - Courses List */}
        <div className="courses-section">
          <h2>
            {selectedCategory === 'All' 
              ? `All Courses in ${selectedCenter}`
              : `${selectedCategory} Courses in ${selectedCenter}`
            }
          </h2>
          
          {loading ? (
            <div className="loading">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="no-courses">
              No courses found for this selection
            </div>
          ) : (
            <div className="courses-grid">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="course-card"
                  onClick={() => handleCourseClick(course.slug)}
                >
                  {course.bannerImage && (
                    <img 
                      src={course.bannerImage.url} 
                      alt={course.title}
                    />
                  )}
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="course-meta">
                    <span>Duration: {course.duration}</span>
                    <span>₹{course.fees?.online?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseListing;
```

---

## 📄 Course Details Page

```javascript
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CourseDetails = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/slug/${slug}`);
        const data = await res.json();
        setCourse(data.course);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="course-details">
      <h1>{course.title}</h1>
      
      {course.bannerImage && (
        <img src={course.bannerImage.url} alt={course.title} />
      )}

      <p>{course.description}</p>

      <div className="course-info">
        <p><strong>Center:</strong> {course.center?.name}</p>
        <p><strong>Category:</strong> {course.category?.name}</p>
        <p><strong>Duration:</strong> {course.duration}</p>
        <p><strong>Start Date:</strong> {
          typeof course.startDate === 'string' 
            ? course.startDate 
            : new Date(course.startDate).toLocaleDateString()
        }</p>
      </div>

      <div className="fees">
        <h3>Fees</h3>
        {course.fees?.online && (
          <p>Online: ₹{course.fees.online.toLocaleString()}</p>
        )}
        {course.fees?.offline && (
          <p>Offline: ₹{course.fees.offline.toLocaleString()}</p>
        )}
      </div>

      {/* Key Highlights */}
      {course.keyHighlights?.keyTitle && (
        <section>
          <h2>{course.keyHighlights.keyTitle}</h2>
          <ul>
            {course.keyHighlights.keyHighlightTexts.map((text, idx) => (
              <li key={idx}>{text}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Why Choose */}
      {course.whyChoose?.whyChooseTitle && (
        <section>
          <h2>{course.whyChoose.whyChooseTitle}</h2>
          {course.whyChoose.whyChooseItems.map((item, idx) => (
            <div key={idx}>
              <h3>{item.whyChooseText}</h3>
              <p>{item.whyChooseContent}</p>
            </div>
          ))}
        </section>
      )}

      {/* How It Helps */}
      {course.howItHelps?.howItHelpsTitle && (
        <section>
          <h2>{course.howItHelps.howItHelpsTitle}</h2>
          <ul>
            {course.howItHelps.howItHelpsTexts.map((text, idx) => (
              <li key={idx}>{text}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Extra Fields (Category-specific data) */}
      {course.extraFields && Object.keys(course.extraFields).length > 0 && (
        <section>
          <h2>Additional Information</h2>
          {Object.entries(course.extraFields).map(([key, value]) => (
            <div key={key}>
              <h3>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
              {Array.isArray(value) ? (
                <ul>
                  {value.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{value}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Brochure */}
      {course.brochure && (
        <a href={course.brochure.url} target="_blank" rel="noopener noreferrer">
          Download Brochure
        </a>
      )}
    </div>
  );
};

export default CourseDetails;
```

---

## 🎨 CSS Styling (Basic)

```css
.course-listing-page {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.centers-sidebar {
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  height: fit-content;
}

.centers-sidebar ul {
  list-style: none;
  padding: 0;
}

.centers-sidebar li {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  transition: background 0.2s;
}

.centers-sidebar li:hover {
  background: #e0e0e0;
}

.centers-sidebar li.active {
  background: #007bff;
  color: white;
}

.categories-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.categories-tabs button {
  padding: 0.75rem 1.5rem;
  border: 2px solid #007bff;
  background: white;
  color: #007bff;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.2s;
}

.categories-tabs button:hover {
  background: #e7f3ff;
}

.categories-tabs button.active-tab {
  background: #007bff;
  color: white;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.course-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.course-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.course-card h3 {
  padding: 1rem;
  margin: 0;
}

.course-card p {
  padding: 0 1rem;
  color: #666;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: #f9f9f9;
  font-weight: bold;
}
```

---

## 📊 Examples

### Example 1: Default Load
```javascript
// No parameters - uses defaults
GET /api/courses
// Returns: New Delhi + GS Foundation courses
```

### Example 2: Change Center
```javascript
GET /api/courses?centerName=Jaipur
// Returns: Jaipur + GS Foundation courses
```

### Example 3: Change Category
```javascript
GET /api/courses?centerName=New Delhi&categoryName=Mentorship
// Returns: New Delhi + Mentorship courses
```

### Example 4: All Categories
```javascript
GET /api/courses?centerName=New Delhi&categoryName=All
// Returns: All categories in New Delhi
```

---

## 🔐 Authentication

✅ **All endpoints are PUBLIC** - no token required

Works for:
- Visitors (no login)
- Students
- Parents
- Employees
- Center Admins
- Super Admins

---

## 🚀 Features

- ✅ Default filtering (New Delhi + GS Foundation)
- ✅ Dynamic center selection
- ✅ Dynamic category selection
- ✅ "All Categories" support
- ✅ Course details by slug
- ✅ Responsive design ready
- ✅ No authentication required
- ✅ Full course data with populated fields

---

## 📝 Notes

1. Centers and categories are fetched once on page load
2. Courses refetch automatically when filters change
3. Empty states handled gracefully
4. Loading states for better UX
5. Course slugs are URL-friendly and unique
