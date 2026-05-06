const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  saveHomePage,
  getHomePage
} = require('../controllers/homePageController');

const {
  createSection4,
  getSection4,
  updateSection4,
  deleteSection4
} = require('../controllers/homeSection4Controller');

const {
  addVideo,
  getVideos,
  updateVideo,
  deleteVideo
} = require('../controllers/homeVideoController');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// ==========================================
// HOME PAGE ROUTES
// ==========================================
router.get('/', getHomePage);
router.post(
  '/',
  protect,
  authorize('super_admin'),
  upload.any(),
  saveHomePage
);

// ==========================================
// SECTION 4 ROUTES (Learning Programs)
// ==========================================
router.route('/section4')
  .get(getSection4)
  .post(protect, authorize('super_admin'), upload.any(), createSection4);

router.route('/section4/:id')
  .put(protect, authorize('super_admin'), upload.any(), updateSection4)
  .delete(protect, authorize('super_admin'), deleteSection4);

// ==========================================
// HOME VIDEO ROUTES (Section 7)
// ==========================================
router.route('/videos')
  .get(getVideos)
  .post(protect, authorize('super_admin'), upload.any(), addVideo);

router.route('/videos/:id')
  .put(protect, authorize('super_admin'), upload.any(), updateVideo)
  .delete(protect, authorize('super_admin'), deleteVideo);

module.exports = router;