const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  type: {
    type: String,
    required: [true, 'Coupon type is required'],
    enum: ['PERCENT', 'FIXED']
  },
  value: {
    type: Number,
    required: [true, 'Coupon value is required'],
    min: [0, 'Value cannot be negative']
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  isNewUserOnly: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    default: 'BOOK'
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Index for faster lookups
CouponSchema.index({ code: 1, isActive: 1 });
CouponSchema.index({ expiryDate: 1 });

module.exports = mongoose.model('Coupon', CouponSchema);
