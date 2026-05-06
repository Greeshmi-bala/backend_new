const express = require('express');
const router = express.Router();
const {
  loginSuperAdmin,
  login,
  sendOtp,
  verifyOtp,
  studentSignup,
  parentLoginRequest
} = require('../controllers/authController');

router.post('/login-super-admin', loginSuperAdmin);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/student-signup', studentSignup);
router.post('/parent-login-request', parentLoginRequest);

module.exports = router;
