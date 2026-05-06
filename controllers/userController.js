const User = require('../models/User');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const { validate, validations } = require('../middleware/validation');

// @desc    Get User Profile
// @route   GET /api/user/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profileData = {};

    // Fetch additional data based on role
    if (user.role === 'student') {
      const student = await Student.findOne({ userId: user._id });
      if (student) {
        profileData.student = student;
      }
    } else if (user.role === 'parent') {
      const parent = await Parent.findOne({ userId: user._id }).populate('studentId');
      if (parent) {
        profileData.parent = parent;
      }
    }

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        ...profileData
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update User Profile
// @route   PUT /api/user/profile
// @access  Private
exports.updateProfile = [
  validate(validations.updateProfile),
  async (req, res) => {
    try {
      const { name, email, mobile } = req.body;

      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update fields
      if (name) user.name = name;
      if (email) user.email = email;
      if (mobile) user.mobile = mobile;

      await user.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile
        }
      });
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        return res.status(400).json({ 
          message: 'Email or mobile already in use by another account' 
        });
      }
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];

// @desc    Change Password
// @route   PUT /api/user/change-password
// @access  Private
exports.changePassword = [
  validate(validations.changePassword),
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user._id).select('+password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if user has password (OTP users may not have one)
      if (!user.password) {
        return res.status(400).json({ 
          message: 'Cannot change password. This account uses OTP login.' 
        });
      }

      // Verify current password
      const isMatch = await user.matchPassword(currentPassword);

      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];
