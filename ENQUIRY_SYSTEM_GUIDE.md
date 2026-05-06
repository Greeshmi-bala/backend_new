# 📞 Enquiry / Demo Booking System

Complete guide for implementing the enquiry/demo booking feature.

---

## 📋 Table of Contents

1. [API Endpoints](#api-endpoints)
2. [Frontend Implementation](#frontend-implementation)
3. [Admin Dashboard](#admin-dashboard)
4. [Examples](#examples)

---

## 🔌 API Endpoints

### 1. Create Enquiry (Public - No Auth)
```bash
POST http://localhost:5000/api/enquiries
Content-Type: application/json
```

**Request Body (Option 1: Using IDs - for developers):**
```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "course": "course_id_here",
  "category": "category_id_here",
  "center": "center_id_here",
  "targetYear": "2026",
  "expectation": "Want to crack UPSC in first attempt"
}
```

**Request Body (Option 2: Using Names - RECOMMENDED for frontend):**
```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "courseTitle": "2 Year GS Foundation Program",
  "categoryName": "GS Foundation",
  "centerName": "New Delhi",
  "targetYear": "2026",
  "expectation": "Want to crack UPSC in first attempt"
}
```

**Required Fields:**
- `name` (String)
- `phone` (String - 10 digit Indian number)
- `course` (ObjectId)

**Optional Fields:**
- `email` (String)
- `category` (ObjectId)
- `center` (ObjectId)
- `targetYear` (String)
- `expectation` (String)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Enquiry submitted successfully! Our team will contact you shortly.",
  "enquiry": {
    "_id": "enquiry_id",
    "name": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com",
    "course": {
      "_id": "course_id",
      "title": "2 Year GS Foundation Program"
    },
    "center": {
      "_id": "center_id",
      "name": "New Delhi"
    },
    "category": {
      "_id": "category_id",
      "name": "GS Foundation"
    },
    "targetYear": "2026",
    "expectation": "Want to crack UPSC in first attempt",
    "status": "new",
    "createdAt": "2026-04-08T10:00:00.000Z"
  }
}
```

**Error Responses:**

❌ Missing required fields (400):
```json
{
  "success": false,
  "message": "Name, phone and course are required"
}
```

❌ Invalid phone number (400):
```json
{
  "success": false,
  "message": "Please enter a valid 10-digit phone number"
}
```

❌ Spam detected (429):
```json
{
  "success": false,
  "message": "You have already submitted an enquiry recently. Please wait a few minutes before submitting again.",
  "waitTime": "5 minutes"
}
```

---

### 2. Get All Enquiries (Admin, Center Admin, Employee)
```bash
GET http://localhost:5000/api/admin/enquiries
Authorization: Bearer YOUR_TOKEN
```

**Access Control:**
- **Super Admin:** Can see ALL enquiries (optionally filter by center)
- **Center Admin:** Can ONLY see their center's enquiries
- **Employee:** Can ONLY see their center's enquiries

**Query Parameters:**
- `status` - Filter by status (new, contacted, converted, closed)
- `center` - Filter by center ID (Super Admin only)
- `course` - Filter by course ID
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "count": 20,
  "total": 150,
  "page": 1,
  "pages": 8,
  "enquiries": [
    {
      "_id": "...",
      "name": "John Doe",
      "phone": "9876543210",
      "course": { "title": "2 Year GS Foundation" },
      "center": { "name": "New Delhi" },
      "status": "new",
      "createdAt": "..."
    }
  ]
}
```

---

### 3. Get Enquiry Statistics (Admin Only)
```bash
GET http://localhost:5000/api/admin/enquiries/stats
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 150,
    "new": 45,
    "contacted": 60,
    "converted": 35,
    "closed": 10,
    "recent": 23
  }
}
```

---

### 4. Update Enquiry (Admin Only)
```bash
PUT http://localhost:5000/api/admin/enquiries/:id
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "contacted",
  "notes": "Student interested in offline batch. Follow up next week."
}
```

---

## 💻 Frontend Implementation

### React Component (Complete)

```javascript
import { useState } from 'react';

const DemoBookingForm = ({ selectedCourse }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    targetYear: '2026',
    expectation: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Auto-fill course details when selectedCourse changes
  useEffect(() => {
    if (selectedCourse) {
      setForm(prev => ({
        ...prev,
        course: selectedCourse._id,
        category: selectedCourse.category?._id,
        center: selectedCourse.center?._id
      }));
    }
  }, [selectedCourse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Reset form
        setForm({
          name: '',
          phone: '',
          email: '',
          targetYear: '2026',
          expectation: '',
          course: form.course,
          category: form.category,
          center: form.center
        });

        // Show success message
        alert('Your FREE Demo class is booked! Our expert mentor will contact you shortly.');
      } else {
        setError(data.message || 'Failed to submit enquiry');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="success-message">
        <h3>🎉 Demo Booked Successfully!</h3>
        <p>Our expert mentor will contact you shortly.</p>
        <button onClick={() => setSuccess(false)}>Book Another Demo</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="demo-booking-form">
      <h3>Book Your FREE Demo Class</h3>

      {error && <div className="error-message">{error}</div>}

      {/* Name */}
      <div className="form-group">
        <label>Name *</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
        />
      </div>

      {/* Phone */}
      <div className="form-group">
        <label>Phone *</label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="10-digit mobile number"
          pattern="[6-9]{1}[0-9]{9}"
          required
        />
      </div>

      {/* Email */}
      <div className="form-group">
        <label>Email (Optional)</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="your@email.com"
        />
      </div>

      {/* Target Year */}
      <div className="form-group">
        <label>Target Year *</label>
        <select
          name="targetYear"
          value={form.targetYear}
          onChange={handleChange}
          required
        >
          <option value="2026">2026</option>
          <option value="2027">2027</option>
          <option value="2028">2028</option>
          <option value="2029">2029</option>
          <option value="2030">2030</option>
        </select>
      </div>

      {/* Expectation */}
      <div className="form-group">
        <label>Your Expectation</label>
        <textarea
          name="expectation"
          value={form.expectation}
          onChange={handleChange}
          placeholder="What do you expect from this course?"
          rows="4"
        />
      </div>

      {/* Submit Button */}
      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? 'Submitting...' : 'Book Your Session'}
      </button>
    </form>
  );
};

export default DemoBookingForm;
```

---

### CSS Styling

```
.demo-booking-form {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.demo-booking-form h3 {
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover {
  background: #0056b3;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-message {
  padding: 1rem;
  background: #fee;
  color: #c00;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.success-message {
  text-align: center;
  padding: 3rem 2rem;
  background: #efe;
  border-radius: 12px;
}

.success-message h3 {
  color: #2a7;
  margin-bottom: 1rem;
}
```

---

## 👨‍💼 Admin Dashboard

### Enquiries Table Component

```javascript
const EnquiriesAdmin = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState({});

  useEffect(() => {
    fetchEnquiries();
    fetchStats();
  }, [filter]);

  const fetchEnquiries = async () => {
    const params = new URLSearchParams(filter);
    const res = await fetch(`/api/admin/enquiries?${params}`);
    const data = await res.json();
    setEnquiries(data.enquiries);
  };

  const fetchStats = async () => {
    const res = await fetch('/api/admin/enquiries/stats');
    const data = await res.json();
    setStats(data.stats);
  };

  const updateStatus = async (id, status) => {
    await fetch(`/api/admin/enquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchEnquiries();
    fetchStats();
  };

  return (
    <div className="admin-enquiries">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total</h3>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card new">
          <h3>New</h3>
          <p>{stats.new}</p>
        </div>
        <div className="stat-card contacted">
          <h3>Contacted</h3>
          <p>{stats.contacted}</p>
        </div>
        <div className="stat-card converted">
          <h3>Converted</h3>
          <p>{stats.converted}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <select onChange={e => setFilter({ status: e.target.value })}>
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Enquiries Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Course</th>
            <th>Center</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map(enquiry => (
            <tr key={enquiry._id}>
              <td>{enquiry.name}</td>
              <td>{enquiry.phone}</td>
              <td>{enquiry.course?.title}</td>
              <td>{enquiry.center?.name}</td>
              <td>
                <select
                  value={enquiry.status}
                  onChange={e => updateStatus(enquiry._id, e.target.value)}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                  <option value="closed">Closed</option>
                </select>
              </td>
              <td>{new Date(enquiry.createdAt).toLocaleDateString()}</td>
              <td>
                <a href={`tel:${enquiry.phone}`}>📞 Call</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

---

## 🔐 Security & Data Integrity Features

✅ **Spam Prevention** - Same phone can't submit within 5 minutes
✅ **Phone Validation** - Only valid 10-digit Indian numbers
✅ **Rate Limiting** - API rate limits prevent abuse
✅ **Required Fields** - Validates name and phone
✅ **Center Validation** - Verifies center matches course (prevents wrong data)
✅ **Category Validation** - Verifies category matches course (prevents wrong data)
✅ **Auto-Derivation** - Always uses course's center & category as source of truth

---

## 🧠 Data Integrity Logic

### Why Validation Matters:

**Problem:** User could send mismatched data
```json
{
  "course": "Course A (Hyderabad)",
  "center": "Pune"  // ❌ Wrong center!
}
```

**Solution:** Backend validates and uses course data
```javascript
// Backend logic:
const courseDoc = await Course.findById(course);

// Always trust course's center & category
const enquiry = await Enquiry.create({
  course: courseDoc._id,
  center: courseDoc.center,     // ✅ From course, not frontend
  category: courseDoc.category  // ✅ From course, not frontend
});
```

### How It Works:

1. **Frontend sends:** center, category, course
2. **Backend validates:** Do they match the course?
3. **If mismatch:** Returns error
4. **If match:** Saves using course's center & category
5. **Result:** Clean, accurate data for admin reports

---

## 📊 Examples

### Example 1: Submit Enquiry from Course Page (Using Names)

```javascript
// User is viewing a course and clicks "Book Demo"
const handleBookDemo = async () => {
  const enquiryData = {
    name: 'Rahul Sharma',
    phone: '9876543210',
    email: 'rahul@example.com',
    // Use names instead of IDs - backend auto-resolves them!
    courseTitle: selectedCourse.title,           // "2 Year GS Foundation Program"
    categoryName: selectedCourse.category.name,  // "GS Foundation"
    centerName: selectedCourse.center.name,      // "New Delhi"
    targetYear: '2026',
    expectation: 'Want comprehensive guidance for UPSC preparation'
  };

  const res = await fetch('/api/enquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enquiryData)
  });

  const data = await res.json();
  
  if (data.success) {
    alert('Demo booked successfully!');
  }
};
```

### Example 2: Simple Form (Only Names)

``javascript
const SimpleEnquiryForm = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    courseTitle: '',      // User types or selects course name
    centerName: '',       // User types or selects center name
    categoryName: '',     // User types or selects category name
    targetYear: '2026',
    expectation: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (data.success) {
      alert('Enquiry submitted!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        placeholder="Your Name" 
        value={form.name}
        onChange={e => setForm({...form, name: e.target.value})}
        required
      />
      
      <input 
        placeholder="Phone" 
        value={form.phone}
        onChange={e => setForm({...form, phone: e.target.value})}
        required
      />
      
      {/* Dropdown for course selection */}
      <select 
        value={form.courseTitle}
        onChange={e => setForm({...form, courseTitle: e.target.value})}
        required
      >
        <option value="">Select Course</option>
        <option value="2 Year GS Foundation Program">2 Year GS Foundation</option>
        <option value="1 Year GS Foundation Program">1 Year GS Foundation</option>
        <option value="UPSC Mentorship Program">Mentorship Program</option>
      </select>
      
      {/* Dropdown for center */}
      <select 
        value={form.centerName}
        onChange={e => setForm({...form, centerName: e.target.value})}
        required
      >
        <option value="">Select Center</option>
        <option value="New Delhi">New Delhi</option>
        <option value="Jaipur">Jaipur</option>
        <option value="Lucknow">Lucknow</option>
      </select>
      
      {/* Dropdown for category */}
      <select 
        value={form.categoryName}
        onChange={e => setForm({...form, categoryName: e.target.value})}
      >
        <option value="">Select Category</option>
        <option value="GS Foundation">GS Foundation</option>
        <option value="Mentorship">Mentorship</option>
        <option value="Test Series">Test Series</option>
      </select>
      
      <button type="submit">Submit Enquiry</button>
    </form>
  );
};
```

### Example 2: Admin Updates Status

``javascript
// Admin marks enquiry as contacted
const markAsContacted = async (enquiryId) => {
  await fetch(`/api/admin/enquiries/${enquiryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      status: 'contacted',
      notes: 'Spoke with student. Interested in offline batch.'
    })
  });
};
```

---

## 🔐 Security Features

✅ **Spam Prevention** - Same phone can't submit within 5 minutes
✅ **Phone Validation** - Only valid 10-digit Indian numbers
✅ **Rate Limiting** - API rate limits prevent abuse
✅ **Required Fields** - Validates name, phone, and course

---

## 🚀 Features

- ✅ Public submission (no login required)
- ✅ Auto-fill from selected course
- ✅ Spam prevention (5-minute cooldown)
- ✅ Phone validation
- ✅ Admin dashboard with stats
- ✅ Status tracking (new → contacted → converted)
- ✅ Pagination support
- ✅ Filter by status/center/course

---

## 📝 Workflow

1. **User** selects course → Fills form → Submits
2. **Backend** validates → Saves enquiry → Returns success
3. **Admin** sees enquiry → Calls student → Updates status
4. **System** tracks conversion rate

---

## 🎯 Next Steps (Optional)

- [ ] Add OTP verification for phone
- [ ] Send WhatsApp notification (Twilio)
- [ ] Send email confirmation (Nodemailer)
- [ ] Auto-assign to center admin
- [ ] Export to CSV
- [ ] Lead analytics dashboard
