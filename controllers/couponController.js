const Coupon = require('../models/Coupon');
const Book = require('../models/Book');
const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Apply coupon to amount
// @route   POST /api/coupons/apply
// @access  Private
exports.applyCoupon = async (req, res) => {
  try {
    const { code, category, amount } = req.body;

    if (!code || !category || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code, category, and amount are required'
      });
    }

    // Find coupon
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }

    // Validate category
    if (coupon.category !== category) {
      return res.status(400).json({
        success: false,
        message: `This coupon is not applicable for ${category}. Applicable for: ${coupon.category}`
      });
    }

    // Check expiry
    if (coupon.expiryDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Coupon has expired'
      });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'Coupon usage limit reached'
      });
    }

    // Check new user only
    if (coupon.isNewUserOnly) {
      const orderCount = await Order.countDocuments({ userId: req.user._id });
      
      if (orderCount > 0) {
        return res.status(400).json({
          success: false,
          message: 'This coupon is only for new users'
        });
      }
    }

    // Calculate discount
    let discount = 0;
    const originalPrice = parseFloat(amount);

    if (coupon.type === 'PERCENT') {
      discount = (originalPrice * coupon.value) / 100;
    } else {
      discount = coupon.value;
    }

    // Prevent negative prices
    const finalPrice = Math.max(0, originalPrice - discount);

    res.json({
      success: true,
      message: 'Coupon applied successfully',
      data: {
        couponCode: coupon.code,
        originalPrice: Math.round(originalPrice),
        discount: Math.round(discount),
        finalPrice: Math.round(finalPrice)
      }
    });
  } catch (error) {
    console.error('Apply Coupon Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while applying coupon',
      error: error.message
    });
  }
};

// @desc    Create coupon
// @route   POST /api/coupons
// @access  Private (Super Admin & Admin)
exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      type,
      value,
      usageLimit,
      isNewUserOnly,
      category,
      expiryDate
    } = req.body;

    // Check if coupon already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists'
      });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      type,
      value: parseFloat(value),
      usageLimit: usageLimit ? parseInt(usageLimit) : null,
      isNewUserOnly: isNewUserOnly === 'true' || isNewUserOnly === true,
      category: category || 'BOOK',
      expiryDate: new Date(expiryDate)
    });

    await coupon.save();

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon
    });
  } catch (error) {
    console.error('Create Coupon Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating coupon',
      error: error.message
    });
  }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private (Super Admin & Admin)
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: coupons.length,
      data: coupons
    });
  } catch (error) {
    console.error('Get Coupons Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching coupons',
      error: error.message
    });
  }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private (Super Admin & Admin)
exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    const {
      code,
      type,
      value,
      usageLimit,
      isNewUserOnly,
      expiryDate,
      isActive
    } = req.body;

    if (code) {
      // Check if new code already exists
      const existingCode = await Coupon.findOne({ 
        code: code.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      if (existingCode) {
        return res.status(400).json({
          success: false,
          message: 'Coupon code already exists'
        });
      }
      coupon.code = code.toUpperCase();
    }
    
    if (type) coupon.type = type;
    if (value !== undefined) coupon.value = parseFloat(value);
    if (usageLimit !== undefined) coupon.usageLimit = parseInt(usageLimit) || null;
    if (isNewUserOnly !== undefined) coupon.isNewUserOnly = isNewUserOnly === 'true' || isNewUserOnly === true;
    if (expiryDate) coupon.expiryDate = new Date(expiryDate);
    if (isActive !== undefined) coupon.isActive = isActive === 'true' || isActive === true;

    await coupon.save();

    res.json({
      success: true,
      message: 'Coupon updated successfully',
      data: coupon
    });
  } catch (error) {
    console.error('Update Coupon Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating coupon',
      error: error.message
    });
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private (Super Admin & Admin)
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    await coupon.deleteOne();

    res.json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    console.error('Delete Coupon Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting coupon',
      error: error.message
    });
  }
};
