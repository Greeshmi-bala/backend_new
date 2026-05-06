# 🧪 Complete API Testing Guide - Sriram IAS Backend

This guide provides **step-by-step testing instructions** for every API endpoint with exact request bodies and expected responses.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Authentication APIs](#authentication-apis)
3. [Admin APIs](#admin-apis)
4. [User APIs](#user-apis)
5. [Testing Scenarios](#testing-scenarios)
6. [Common Errors](#common-errors)

---

## 🔧 Prerequisites

### 1. Start the Server
```bash
npm run dev
```

Expected output:
```
╔═══════════════════════════════════════════════╗
║   🚀 Sriram IAS Backend Server               ║
║   📍 Port: 5000                              ║
║   MongoDB Connected: ...                      ║
╚═══════════════════════════════════════════════╝
```

### 2. Tools Needed
- **Postman** (Recommended) or **curl** or **Thunder Client** (VS Code)
- Base URL: `http://localhost:5000/api`

### 3. Default Credentials
```
Super Admin Email: admin@sriram.com
Super Admin Password: admin123
```

---

## 🔑 Authentication APIs

### 1️⃣ Super Admin Login

**Endpoint:** `POST /api/auth/login-super-admin`

**Purpose:** Login as super administrator with full system access

**Request Body:**
```json
{
  "email": "admin@sriram.com",
  "password": "admin123"
}
```

**Headers:**
```
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1234567890abcdef12345",
    "name": "Super Admin",
    "email": "admin@sriram.com",
    "role": "super_admin"
  }
}
```

**Save the token!** You'll need it for admin operations.

**Test Cases:**
- ✅ Valid credentials → 200 OK with token
- ❌ Wrong password → 401 "Invalid credentials"
- ❌ Wrong email → 401 "Invalid credentials"
- ❌ Missing fields → 400 Validation error

---

### 2️⃣ Center Admin / Employee Login

**Endpoint:** `POST /api/auth/login`

**Purpose:** Login for center admins and employees (password-based)

**Request Body:**
```json
{
  "email": "admin@hyderabad.com",
  "password": "password123"
}
```

**Note:** You need to create a center admin first (see Admin APIs section)

**Expected Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1234567890abcdef12346",
    "name": "Hyderabad Admin",
    "email": "admin@hyderabad.com",
    "role": "center_admin",
    "location": "Hyderabad"
  }
}
```

**Test Cases:**
- ✅ Valid center admin → 200 OK
- ✅ Valid employee → 200 OK
- ❌ Student trying this endpoint → 403 "Use OTP login"
- ❌ Wrong password → 401 "Invalid credentials"

---

### 3️⃣ Student Signup

**Endpoint:** `POST /api/auth/student-signup`

**Purpose:** Register a new student account

**Request Body:**
```json
{
  "name": "Rahul Sharma",
  "mobile": "9876543210",
  "email": "rahul@example.com",
  "parentName": "Suresh Sharma",
  "parentMobile": "9876543211",
  "parentEmail": "suresh@example.com"
}
```

**Field Requirements:**
- `name`: Student's full name (required)
- `mobile`: Indian mobile number starting with 6-9 (required OR email)
- `email`: Valid email format (optional if mobile provided)
- `parentName`: Parent's full name (required)
- `parentMobile`: Parent's Indian mobile number (required)
- `parentEmail`: Parent's email (optional)

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Student registered successfully",
  "user": {
    "id": "65f1234567890abcdef12347",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "mobile": "9876543210",
    "role": "student"
  }
}
```

**Test Cases:**
- ✅ Valid data → 201 Created
- ❌ Duplicate mobile → 400 "User already exists"
- ❌ Invalid mobile format → 400 "Invalid Indian mobile number"
- ❌ Missing parentName → 400 Validation error
- ❌ Missing both mobile & email → 400 "Either mobile or email is required"

**Example with only mobile:**
```json
{
  "name": "Priya Patel",
  "mobile": "9123456789",
  "parentName": "Rajesh Patel",
  "parentMobile": "9988776655"
}
```

---

### 4️⃣ Send OTP

**Endpoint:** `POST /api/auth/send-otp`

**Purpose:** Request OTP for student or parent login

**Request Body (Option 1 - Mobile):**
```json
{
  "mobile": "9876543210"
}
```

**Request Body (Option 2 - Email):**
```json
{
  "email": "rahul@example.com"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

**Check Server Console:**
```
🔐 OTP (student) for 9876543210: 123456
```

**Test Cases:**
- ✅ Registered user → 200 OK + OTP in console
- ❌ Unregistered mobile → 404 "User not found"
- ❌ Invalid mobile format → 400 "Invalid Indian mobile number"
- ❌ Deactivated account → 403 "Account is deactivated"
- ❌ Too many requests → 429 "Too many OTP requests"

**Rate Limiting:**
- Max 5 OTPs per user per hour
- Max 5 requests per IP per 15 minutes

---

### 5️⃣ Verify OTP & Login

**Endpoint:** `POST /api/auth/verify-otp`

**Purpose:** Verify OTP and receive JWT token

**Request Body:**
```json
{
  "mobile": "9876543210",
  "otp": "123456"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1234567890abcdef12347",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "mobile": "9876543210",
    "role": "student"
  }
}
```

**Test Cases:**
- ✅ Correct OTP → 200 OK with token
- ❌ Wrong OTP → 400 "Invalid OTP"
- ❌ Expired OTP (>5 min) → 400 "OTP has expired"
- ❌ 3 failed attempts → 400 "Maximum attempts exceeded"
- ❌ Unregistered mobile → 404 "User not found"

**Important Notes:**
- OTP expires in 5 minutes
- Maximum 3 verification attempts
- OTP is deleted after successful verification
- Works for both students and parents

---

### 6️⃣ Parent Login Request

**Endpoint:** `POST /api/auth/parent-login-request`

**Purpose:** Initiate parent login by verifying student-parent relationship

**Request Body:**
```json
{
  "studentMobile": "9876543210",
  "parentMobile": "9876543211"
}
```

**What Happens:**
1. System finds student by `studentMobile`
2. Verifies `parentMobile` matches student's parent record
3. Creates parent user account (if doesn't exist)
4. Links parent ↔ student in database
5. Sends OTP to parent's mobile

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP sent to parent's registered mobile"
}
```

**Check Server Console:**
```
🔐 OTP (parent) for 9876543211: 654321
```

**Next Step:** Use the OTP with `/verify-otp` endpoint to complete login

**Test Cases:**
- ✅ Valid student & parent mobile → 200 OK + OTP sent
- ❌ Student not found → 404 "No student found"
- ❌ Parent mobile mismatch → 400 "Parent mobile does not match"
- ❌ Invalid mobile format → 400 Validation error

**Complete Parent Login Flow:**

**Step 1:** Request OTP
```json
POST /api/auth/parent-login-request
{
  "studentMobile": "9876543210",
  "parentMobile": "9876543211"
}
```

**Step 2:** Verify OTP (use OTP from console)
```json
POST /api/auth/verify-otp
{
  "mobile": "9876543211",
  "otp": "654321"
}
```

**Result:** Parent receives JWT token and can access their profile

---

## 👨‍💼 Admin APIs

**Note:** All admin endpoints require authentication. Add this header:
```
Authorization: Bearer YOUR_SUPER_ADMIN_TOKEN
```

### 7️⃣ Create Center Admin

**Endpoint:** `POST /api/admin/create-center-admin`

**Purpose:** Create a new center administrator (Super Admin only)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <super_admin_token>
```

**Request Body:**
```json
{
  "name": "Hyderabad Admin",
  "email": "admin@hyderabad.com",
  "password": "Hyd@2024Secure",
  "location": "Hyderabad"
}
```

**Field Requirements:**
- `name`: Full name (min 2 chars)
- `email`: Valid email (must be unique)
- `password`: Min 8 characters
- `location`: Must be one of: "Hyderabad", "New Delhi", "Pune"

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Center admin created successfully",
  "user": {
    "id": "65f1234567890abcdef12348",
    "name": "Hyderabad Admin",
    "email": "admin@hyderabad.com",
    "role": "center_admin",
    "location": "Hyderabad"
  }
}
```

**Test Cases:**
- ✅ Valid data → 201 Created
- ❌ Duplicate email → 400 "User already exists"
- ❌ Weak password (<8 chars) → 400 Validation error
- ❌ Invalid location → 400 Validation error
- ❌ Non-super-admin → 403 "Access denied"

**Create Multiple Centers:**
```json
// New Delhi Center
{
  "name": "Delhi Admin",
  "email": "admin@delhi.com",
  "password": "Delhi@2024Secure",
  "location": "New Delhi"
}

// Pune Center
{
  "name": "Pune Admin",
  "email": "admin@pune.com",
  "password": "Pune@2024Secure",
  "location": "Pune"
}
```

---

### 8️⃣ Create Employee

**Endpoint:** `POST /api/admin/create-employee`

**Purpose:** Create employee account (Super Admin or Center Admin)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "John Teacher",
  "email": "john@sriram.com",
  "password": "Teacher@2024",
  "permissions": ["view_students", "update_attendance"],
  "center": "Hyderabad"
}
```

**Field Requirements:**
- `name`: Full name (required)
- `email`: Valid unique email (required)
- `password`: Min 8 characters (required)
- `permissions`: Array of permission strings (optional)
- `center`: Location (optional, defaults to admin's location)

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "user": {
    "id": "65f1234567890abcdef12349",
    "name": "John Teacher",
    "email": "john@sriram.com",
    "role": "employee",
    "location": "Hyderabad",
    "permissions": ["view_students", "update_attendance"]
  }
}
```

**Test Cases:**
- ✅ Valid data → 201 Created
- ❌ Duplicate email → 400 "User already exists"
- ❌ Center admin creating for wrong location → 403 Forbidden
- ❌ Employee accessing this endpoint → 403 Access denied

**Permission Examples:**
```json
"permissions": [
  "view_students",
  "update_attendance",
  "create_tests",
  "view_reports",
  "manage_fees"
]
```

---

### 9️⃣ Get Users (List with Pagination)

**Endpoint:** `GET /api/admin/users`

**Purpose:** Retrieve list of users with filtering and pagination

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
```
?role=student&location=Hyderabad&page=1&limit=10
```

**Available Filters:**
- `role`: Filter by role (student, parent, employee, center_admin)
- `location`: Filter by location (Super Admin only)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Full URL Example:**
```
GET http://localhost:5000/api/admin/users?role=student&page=1&limit=5
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "total": 25,
  "page": 1,
  "pages": 5,
  "users": [
    {
      "id": "65f1234567890abcdef12347",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "mobile": "9876543210",
      "role": "student",
      "location": "Hyderabad",
      "isActive": true,
      "createdAt": "2026-04-04T05:30:00.000Z"
    },
    // ... more users
  ]
}
```

**Test Cases:**
- ✅ No filters → Returns all accessible users
- ✅ Filter by role → Only that role
- ✅ Center admin → Only their location
- ✅ Super admin → All locations
- ✅ Pagination → Correct page info

**Example Queries:**

Get all students:
```
GET /api/admin/users?role=student
```

Get employees in Hyderabad:
```
GET /api/admin/users?role=employee&location=Hyderabad
```

Get page 2 with 20 items:
```
GET /api/admin/users?page=2&limit=20
```

---

### 🔟 Update User Status (Activate/Deactivate)

**Endpoint:** `PUT /api/admin/user/:id/status`

**Purpose:** Activate or deactivate a user account

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <admin_token>
```

**URL Parameter:**
- `:id` = User ID (e.g., `65f1234567890abcdef12347`)

**Request Body:**
```json
{
  "isActive": false
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "User deactivated successfully",
  "user": {
    "id": "65f1234567890abcdef12347",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "isActive": false
  }
}
```

**To Reactivate:**
```json
{
  "isActive": true
}
```

**Test Cases:**
- ✅ Deactivate user → 200 OK
- ✅ Reactivate user → 200 OK
- ❌ Invalid user ID → 404 "User not found"
- ❌ Center admin managing other location → 403 Forbidden
- ❌ Deactivated user tries login → 403 "Account is deactivated"

**Full URL Example:**
```
PUT http://localhost:5000/api/admin/user/65f1234567890abcdef12347/status
```

---

### 1️⃣1️⃣ Get Centers

**Endpoint:** `GET /api/admin/centers`

**Purpose:** List all centers with their admins (Super Admin only)

**Headers:**
```
Authorization: Bearer <super_admin_token>
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "centers": [
    {
      "id": "65f1234567890abcdef12350",
      "location": "Hyderabad",
      "adminId": {
        "id": "65f1234567890abcdef12348",
        "name": "Hyderabad Admin",
        "email": "admin@hyderabad.com"
      },
      "createdAt": "2026-04-04T05:00:00.000Z"
    },
    {
      "id": "65f1234567890abcdef12351",
      "location": "New Delhi",
      "adminId": {
        "id": "65f1234567890abcdef12352",
        "name": "Delhi Admin",
        "email": "admin@delhi.com"
      },
      "createdAt": "2026-04-04T05:15:00.000Z"
    }
  ]
}
```

**Test Cases:**
- ✅ Super admin → 200 OK with all centers
- ❌ Center admin → 403 Access denied
- ❌ Employee → 403 Access denied

---

## 👤 User APIs

**Note:** All user endpoints require authentication.

### 1️⃣2️⃣ Get Profile

**Endpoint:** `GET /api/user/profile`

**Purpose:** Get current user's profile information

**Headers:**
```
Authorization: Bearer <user_token>
```

**Expected Response for Student (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "65f1234567890abcdef12347",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "mobile": "9876543210",
    "role": "student",
    "location": "Hyderabad",
    "isActive": true,
    "student": {
      "userId": "65f1234567890abcdef12347",
      "parentName": "Suresh Sharma",
      "parentMobile": "9876543211",
      "parentEmail": "suresh@example.com"
    }
  }
}
```

**Expected Response for Parent (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "65f1234567890abcdef12360",
    "name": "Suresh Sharma",
    "email": "suresh@example.com",
    "mobile": "9876543211",
    "role": "parent",
    "parent": {
      "userId": "65f1234567890abcdef12360",
      "studentId": {
        "id": "65f1234567890abcdef12347",
        "userId": {
          "name": "Rahul Sharma",
          "mobile": "9876543210"
        }
      }
    }
  }
}
```

**Test Cases:**
- ✅ Valid token → 200 OK with profile
- ❌ Invalid token → 401 "Not authorized"
- ❌ No token → 401 "Not authorized, no token"
- ❌ Deactivated user → 403 "Account is deactivated"

---

### 1️⃣3️⃣ Update Profile

**Endpoint:** `PUT /api/user/profile`

**Purpose:** Update user's profile information

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <user_token>
```

**Request Body (Update Name & Mobile):**
```json
{
  "name": "Rahul Kumar Sharma",
  "mobile": "9876543299"
}
```

**Request Body (Update Email Only):**
```json
{
  "email": "newemail@example.com"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "65f1234567890abcdef12347",
    "name": "Rahul Kumar Sharma",
    "email": "rahul@example.com",
    "mobile": "9876543299"
  }
}
```

**Test Cases:**
- ✅ Valid update → 200 OK
- ❌ Invalid mobile format → 400 Validation error
- ❌ Invalid email format → 400 Validation error
- ❌ Duplicate email/mobile → 400 "Already in use"
- ❌ Empty body → 400 Validation error

---

### 1️⃣4️⃣ Change Password

**Endpoint:** `PUT /api/user/change-password`

**Purpose:** Change password for password-based accounts

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <user_token>
```

**Request Body:**
```json
{
  "currentPassword": "Hyd@2024Secure",
  "newPassword": "NewSecure@2024"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Test Cases:**
- ✅ Correct current password → 200 OK
- ❌ Wrong current password → 401 "Current password is incorrect"
- ❌ Weak new password (<8 chars) → 400 Validation error
- ❌ OTP-only user (student/parent) → 400 "Cannot change password"
- ❌ Missing fields → 400 Validation error

**Note:** Students and parents use OTP login, so they cannot change passwords.

---

## 🧪 Complete Testing Scenarios

### Scenario 1: Complete Student Journey

**Step 1:** Signup
```bash
POST /api/auth/student-signup
{
  "name": "Amit Kumar",
  "mobile": "9999888877",
  "email": "amit@student.com",
  "parentName": "Vijay Kumar",
  "parentMobile": "9999777766",
  "parentEmail": "vijay@parent.com"
}
```

**Step 2:** Request OTP
```bash
POST /api/auth/send-otp
{
  "mobile": "9999888877"
}
```
*Check console for OTP*

**Step 3:** Verify OTP & Login
```bash
POST /api/auth/verify-otp
{
  "mobile": "9999888877",
  "otp": "123456"  // From console
}
```
*Save the token*

**Step 4:** Get Profile
```bash
GET /api/user/profile
Authorization: Bearer <student_token>
```

**Step 5:** Update Profile
```bash
PUT /api/user/profile
Authorization: Bearer <student_token>
{
  "name": "Amit Kumar Singh"
}
```

---

### Scenario 2: Complete Parent Journey

**Step 1:** Ensure student exists (from Scenario 1)

**Step 2:** Parent Login Request
```bash
POST /api/auth/parent-login-request
{
  "studentMobile": "9999888877",
  "parentMobile": "9999777766"
}
```
*Check console for OTP*

**Step 3:** Verify OTP
```bash
POST /api/auth/verify-otp
{
  "mobile": "9999777766",
  "otp": "654321"  // From console
}
```
*Save parent token*

**Step 4:** Get Parent Profile
```bash
GET /api/user/profile
Authorization: Bearer <parent_token>
```

---

### Scenario 3: Complete Admin Setup

**Step 1:** Super Admin Login
```bash
POST /api/auth/login-super-admin
{
  "email": "admin@sriram.com",
  "password": "admin123"
}
```
*Save super admin token*

**Step 2:** Create Center Admin
```bash
POST /api/admin/create-center-admin
Authorization: Bearer <super_admin_token>
{
  "name": "Bangalore Admin",
  "email": "admin@bangalore.com",
  "password": "Bangalore@2024",
  "location": "Hyderabad"
}
```

**Step 3:** Center Admin Login
```bash
POST /api/auth/login
{
  "email": "admin@bangalore.com",
  "password": "Bangalore@2024"
}
```
*Save center admin token*

**Step 4:** Create Employee
```bash
POST /api/admin/create-employee
Authorization: Bearer <center_admin_token>
{
  "name": "Math Teacher",
  "email": "math@sriram.com",
  "password": "Math@2024Secure",
  "permissions": ["view_students", "update_attendance"]
}
```

**Step 5:** View All Students
```bash
GET /api/admin/users?role=student
Authorization: Bearer <center_admin_token>
```

---

### Scenario 4: User Management

**Step 1:** Get All Users
```bash
GET /api/admin/users?page=1&limit=10
Authorization: Bearer <super_admin_token>
```

**Step 2:** Deactivate User
```bash
PUT /api/admin/user/USER_ID_HERE/status
Authorization: Bearer <super_admin_token>
{
  "isActive": false
}
```

**Step 3:** Try Login with Deactivated User
```bash
POST /api/auth/login
{
  "email": "deactivated@example.com",
  "password": "password123"
}
```
*Expected: 403 "Account is deactivated"*

**Step 4:** Reactivate User
```bash
PUT /api/admin/user/USER_ID_HERE/status
Authorization: Bearer <super_admin_token>
{
  "isActive": true
}
```

---

## ❌ Common Errors & Solutions

### Error 1: Validation Failed
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "mobile",
      "message": "Invalid Indian mobile number"
    }
  ]
}
```
**Solution:** Use valid Indian mobile format (starts with 6-9, 10 digits)

---

### Error 2: Not Authorized
```json
{
  "message": "Not authorized, no token"
}
```
**Solution:** Add `Authorization: Bearer YOUR_TOKEN` header

---

### Error 3: Access Denied
```json
{
  "message": "Access denied. Insufficient permissions.",
  "required": ["super_admin"],
  "current": "employee"
}
```
**Solution:** Use correct role's token for the operation

---

### Error 4: User Already Exists
```json
{
  "message": "User already exists with this mobile or email"
}
```
**Solution:** Use different mobile/email or login instead

---

### Error 5: Invalid OTP
```json
{
  "message": "Invalid OTP"
}
```
**Solution:** 
- Check console for correct OTP
- OTP expires in 5 minutes
- Max 3 attempts allowed

---

### Error 6: Too Many Requests
```json
{
  "success": false,
  "message": "Too many OTP requests. Please try again after 1 hour."
}
```
**Solution:** Wait 1 hour or use different account

---

## 📊 Testing Checklist

Use this checklist to ensure everything works:

### Authentication
- [ ] Super admin login works
- [ ] Center admin login works
- [ ] Employee login works
- [ ] Student signup works
- [ ] Student OTP login works
- [ ] Parent login flow works
- [ ] Invalid credentials rejected
- [ ] Deactivated users blocked

### Validation
- [ ] Invalid mobile format rejected
- [ ] Invalid email format rejected
- [ ] Weak passwords rejected
- [ ] Missing required fields caught
- [ ] Duplicate users prevented

### Admin Operations
- [ ] Create center admin works
- [ ] Create employee works
- [ ] List users with filters works
- [ ] Activate/deactivate works
- [ ] Location restrictions enforced
- [ ] Role restrictions enforced

### User Operations
- [ ] Get profile works
- [ ] Update profile works
- [ ] Change password works
- [ ] OTP users can't change password

### Security
- [ ] Rate limiting active
- [ ] OTP attempt limiting works
- [ ] Token expiration works
- [ ] Unauthorized access blocked

---

## 🎯 Quick Test Commands (cURL)

### Health Check
```bash
curl http://localhost:5000/health
```

### Super Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login-super-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sriram.com","password":"admin123"}'
```

### Student Signup
```bash
curl -X POST http://localhost:5000/api/auth/student-signup \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test Student",
    "mobile":"9123456789",
    "parentName":"Test Parent",
    "parentMobile":"9988776655"
  }'
```

### Send OTP
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9123456789"}'
```

---

## 📝 Notes

1. **Always check server console** for OTP codes in development
2. **Save tokens** securely for subsequent requests
3. **Test error cases** to ensure proper validation
4. **Use Postman Collections** for easier testing (import `postman_collection.json`)
5. **Rate limits apply** - don't spam requests
6. **MongoDB must be connected** before testing

---

## 🚀 Ready to Test!

Your backend is fully functional and ready for comprehensive testing. Follow this guide step-by-step to verify all features work correctly.

**Happy Testing!** 🎉
