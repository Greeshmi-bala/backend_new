const express = require('express');
const router = express.Router();
const {
  applyCoupon,
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon
} = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public/User routes
router.post('/apply', protect, applyCoupon);

// Admin routes
router.post('/', protect, authorize('super_admin', 'admin'), createCoupon);
router.get('/', protect, authorize('super_admin', 'admin'), getCoupons);
router.put('/:id', protect, authorize('super_admin', 'admin'), updateCoupon);
router.delete('/:id', protect, authorize('super_admin', 'admin'), deleteCoupon);

module.exports = router;
