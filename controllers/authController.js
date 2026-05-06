const User = require('../models/User');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const generateToken = require('../utils/generateToken');
const { sendOTP, verifyOTP } = require('../utils/otpService');
const { validate, validations } = require('../middleware/validation');

// @desc    Super Admin Login
// @route   POST /api/auth/login-super-admin
// @access  Public
exports.loginSuperAdmin = [
  validate(validations.superAdminLogin),
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check against environment variables
      if (
        email !== process.env.SUPER_ADMIN_EMAIL ||
        password !== process.env.SUPER_ADMIN_PASSWORD
      ) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Find or create super admin user
      let user = await User.findOne({ email, role: 'super_admin' });

      if (!user) {
        user = await User.create({
          name: 'Super Admin',
          email,
          password,
          role: 'super_admin',
          isActive: true
        });
      }

      res.json({
        success: true,
        token: generateToken(user),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];

// @desc    Login (Center Admin & Employee)
// @route   POST /api/auth/login
// @access  Public
exports.login = [
  validate(validations.login),
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({ message: 'Account is deactivated' });
      }

      // Check if role is allowed (only center_admin and employee can use this)
      if (!['center_admin', 'employee'].includes(user.role)) {
        return res.status(403).json({ 
          message: 'Please use OTP login for students and parents' 
        });
      }

      // Check password
      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      res.json({
        success: true,
        token: generateToken(user),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          location: user.location
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];

// @desc    Send OTP
// @route   POST /api/auth/send-otp
// @access  Public
exports.sendOtp = async (req, res) => {
  try {
    const { mobile, email } = req.body;

    // Validate input - must provide either email or mobile
    if (!email && !mobile) {
      return res.status(400).json({ 
        message: 'Email or mobile is required' 
      });
    }

    // Find user with STRICT query (not $or)
    let user;
    if (email) {
      user = await User.findOne({ email: email.toLowerCase().trim() });
    } else if (mobile) {
      user = await User.findOne({ mobile: mobile.trim() });
    }

    console.log('Send OTP - Email:', email, 'Mobile:', mobile);
    console.log('User found:', user ? { id: user._id, name: user.name, role: user.role } : 'null');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    // Determine OTP type based on user role
    const otpType = user.role === 'parent' ? 'parent' : 'student';

    // Send OTP
    try {
      await sendOTP(user._id, mobile, email, otpType);
    } catch (error) {
      return res.status(429).json({ message: error.message });
    }

    // Return userId so client doesn't need to send email again
    res.json({
      success: true,
      message: 'OTP sent successfully',
      userId: user._id.toString()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify OTP and Login
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, email, otp } = req.body;

    // Validate input - must provide email or mobile
    if (!email && !mobile) {
      return res.status(400).json({ 
        message: 'Email or mobile is required' 
      });
    }

    if (!otp) {
      return res.status(400).json({ 
        message: 'OTP is required' 
      });
    }

    // Find user by email or mobile (strict query - backend finds userId internally)
    let user;
    if (email) {
      user = await User.findOne({ email: email.toLowerCase().trim() });
    } else if (mobile) {
      user = await User.findOne({ mobile: mobile.trim() });
    }

    console.log('Verify OTP - Email:', email, 'Mobile:', mobile);
    console.log('User found:', user ? { id: user._id, name: user.name, role: user.role } : 'null');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    // Determine OTP type based on user role
    const otpType = user.role === 'parent' ? 'parent' : 'student';

    // Verify OTP using user's internal ID
    const verification = await verifyOTP(user._id, otp, otpType);

    if (!verification.valid) {
      return res.status(400).json({ message: verification.message });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Student Signup
// @route   POST /api/auth/student-signup
// @access  Public
exports.studentSignup = async (req, res) => {
  try {
    const { name, mobile, email, parentName, parentMobile, parentEmail } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ mobile }, { email }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this mobile or email' 
      });
    }

    // Create user
    const user = await User.create({
      name,
      mobile,
      email,
      role: 'student',
      isActive: true
    });

    // Create student profile
    const student = await Student.create({
      userId: user._id,
      parentName,
      parentMobile,
      parentEmail
    });

    // Generate JWT token for immediate login
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'User already exists with this mobile or email' 
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Parent Login Request
// @route   POST /api/auth/parent-login-request
// @access  Public
exports.parentLoginRequest = async (req, res) => {
  try {
    const { studentEmail, studentMobile, parentEmail, parentMobile } = req.body;

    // Validate input - must provide at least one student identifier and one parent identifier
    if (!studentEmail && !studentMobile) {
      return res.status(400).json({ 
        message: 'Student email or mobile is required' 
      });
    }

    if (!parentEmail && !parentMobile) {
      return res.status(400).json({ 
        message: 'Parent email or mobile is required' 
      });
    }

    // Step 1: Find student by email or mobile
    let studentUser;
    if (studentEmail) {
      studentUser = await User.findOne({ 
        email: studentEmail.toLowerCase().trim(), 
        role: 'student' 
      });
    } else if (studentMobile) {
      studentUser = await User.findOne({ 
        mobile: studentMobile.trim(), 
        role: 'student' 
      });
    }

    console.log('Parent Login - Student lookup:', studentEmail || studentMobile);
    console.log('Student user found:', studentUser ? { id: studentUser._id, name: studentUser.name } : 'null');

    if (!studentUser) {
      return res.status(404).json({ 
        message: 'No student found with provided credentials' 
      });
    }

    // Step 2: Get student profile
    const student = await Student.findOne({ userId: studentUser._id });

    if (!student) {
      return res.status(404).json({ 
        message: 'Student profile not found' 
      });
    }

    // Step 3: Verify parent credentials match student's parent info
    let parentMatches = false;

    if (parentEmail && student.parentEmail) {
      parentMatches = student.parentEmail.toLowerCase().trim() === parentEmail.toLowerCase().trim();
    } else if (parentMobile && student.parentMobile) {
      parentMatches = student.parentMobile.trim() === parentMobile.trim();
    }

    if (!parentMatches) {
      return res.status(400).json({ 
        message: 'Parent details do not match our records for this student' 
      });
    }

    console.log('✅ Parent credentials verified for student:', studentUser.name);

    // Step 4: Check if parent user exists, if not create one
    let parentUser;
    if (parentEmail) {
      parentUser = await User.findOne({ 
        email: parentEmail.toLowerCase().trim(), 
        role: 'parent' 
      });
    } else {
      parentUser = await User.findOne({ 
        mobile: parentMobile.trim(), 
        role: 'parent' 
      });
    }

    if (!parentUser) {
      // Create parent user account
      parentUser = await User.create({
        name: student.parentName,
        email: student.parentEmail,
        mobile: student.parentMobile,
        role: 'parent',
        isActive: true
      });

      // Link parent to student in Parents collection
      await Parent.create({
        userId: parentUser._id,
        studentId: student._id
      });

      console.log('✅ Parent account created and linked to student');
    }

    // Step 5: Send OTP to parent's email (preferred) or mobile
    const otpEmail = parentUser.email || parentEmail;
    const otpMobile = parentUser.mobile || parentMobile;

    try {
      await sendOTP(parentUser._id, otpMobile, otpEmail, 'parent');
    } catch (error) {
      return res.status(429).json({ message: error.message });
    }

    res.json({
      success: true,
      message: 'OTP sent to parent\'s registered email',
      sentTo: otpEmail ? 'email' : 'mobile'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
