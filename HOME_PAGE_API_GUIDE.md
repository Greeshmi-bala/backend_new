# Home Page CMS API Documentation

## Overview
Complete Content Management System for the home page with sections, toppers, centers, learning programs, and video management.

---

## Base URL
```
http://localhost:5000/api
```

---

## Table of Contents
1. [Get Home Page Data](#1-get-home-page-data)
2. [Save/Update Home Page](#2-saveupdate-home-page)
3. [Home Video Management](#3-home-video-management)
   - [Create Video](#31-create-video)
   - [Get All Videos](#32-get-all-videos)
   - [Update Video](#33-update-video)
   - [Delete Video](#34-delete-video)
4. [Complete Code](#complete-code)

---

## 1. Get Home Page Data

**Endpoint:** `GET /homepage`

**Access:** Public

**Description:** Retrieves all home page sections including videos from HomeVideo collection.

### Response Format

```json
{
  "success": true,
  "data": {
    "_id": "69e788e7633359dde65ffe33",
    "section1": {
      "videoUrl": "https://youtube.com/embed/..."
    },
    "section2": {
      "iconImage": "https://res.cloudinary.com/.../icon.jpg",
      "text": "India's Best IAS Coaching",
      "backgroundImage": "https://res.cloudinary.com/.../bg.jpg"
    },
    "section3": {
      "title": "OUR TOPPERS",
      "subTitle": "Celebrating Success Stories",
      "toppers": [
        {
          "_id": "...",
          "image": "https://res.cloudinary.com/.../topper1.jpg",
          "name": "Darshan Kumar",
          "rank": "AIR 08",
          "description": "GS Foundation Course 2025"
        }
      ]
    },
    "section4": {
      "title": "OUR LEARNING PROGRAMS",
      "subSections": [
        {
          "_id": "...",
          "title": "Foundation Courses",
          "description": "Comprehensive preparation for UPSC CSE",
          "images": [
            "https://res.cloudinary.com/.../img1.jpg",
            "https://res.cloudinary.com/.../img2.jpg"
          ]
        }
      ]
    },
    "section5": {
      "title": "OUR CENTRES",
      "cards": [
        {
          "_id": "...",
          "image": "https://res.cloudinary.com/.../hyd.jpg",
          "name": "Hyderabad"
        },
        {
          "_id": "...",
          "image": "https://res.cloudinary.com/.../delhi.jpg",
          "name": "Delhi"
        }
      ]
    },
    "section6": {
      "title": "OUR STORY",
      "image": "https://res.cloudinary.com/.../story.jpg",
      "description": "15+ years of excellence",
      "subDescription": "Guiding thousands of aspirants",
      "stats": [
        {
          "_id": "...",
          "number": "50,000+",
          "text": "Students"
        },
        {
          "_id": "...",
          "number": "500+",
          "text": "Selections"
        }
      ]
    },
    "section7": {
      "videos": [
        {
          "_id": "69ec...",
          "videoUrl": "https://youtube.com/watch?v=abc123",
          "videoThumbnail": "https://res.cloudinary.com/.../thumb1.jpg"
        },
        {
          "_id": "69ec...",
          "videoUrl": "https://youtube.com/watch?v=def456",
          "videoThumbnail": "https://res.cloudinary.com/.../thumb2.jpg"
        }
      ]
    },
    "createdAt": "2026-04-21T14:25:43.615Z",
    "updatedAt": "2026-04-21T14:25:43.615Z"
  }
}
```

### Testing with cURL

```bash
curl -X GET http://localhost:5000/api/homepage
```

### Testing with Postman

1. **Method:** GET
2. **URL:** `http://localhost:5000/api/homepage`
3. **Headers:** None required
4. **Send Request**

---

## 2. Save/Update Home Page

**Endpoint:** `POST /homepage`

**Access:** Private (Super Admin only)

**Authentication Required:** Yes

**Content-Type:** `multipart/form-data`

**Description:** Creates or updates home page sections. Supports file uploads for images.

### Request Body (FormData)

#### Section 1: Video Tutorial
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `section1_videoUrl` | Text | No | YouTube embed URL |

#### Section 2: Hero Banner
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `section2_text` | Text | No | Main heading text |
| `section2_iconImage` | File | No | Icon image (JPG, PNG) |
| `section2_backgroundImage` | File | No | Background image (JPG, PNG) |

#### Section 3: Toppers
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `section3_title` | Text | No | Section title |
| `section3_subTitle` | Text | No | Section subtitle |
| `section3_toppers` | JSON String | No | Array of topper objects |
| `section3_toppers_images` | File | No | Tapper images (multiple) |

**section3_toppers Format:**
```json
[
  {
    "name": "Darshan Kumar",
    "rank": "AIR 08",
    "description": "GS Foundation Course 2025"
  },
  {
    "name": "Priya Sharma",
    "rank": "AIR 15",
    "description": "Optional - Geography"
  }
]
```

#### Section 4: Learning Programs
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `section4_title` | Text | No | Section title |
| `section4_subSections` | JSON String | No | Array of subsection objects |

**section4_subSections Format:**
```json
[
  {
    "title": "Foundation Courses",
    "description": "Comprehensive preparation for UPSC CSE",
    "images": [
      "https://res.cloudinary.com/.../img1.jpg",
      "https://res.cloudinary.com/.../img2.jpg"
    ]
  },
  {
    "title": "Test Series",
    "description": "Mock tests and practice papers",
    "images": [
      "https://res.cloudinary.com/.../img3.jpg"
    ]
  }
]
```

#### Section 5: Centers
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `section5_title` | Text | No | Section title |
| `section5_cards` | JSON String | No | Array of center cards |
| `section5_cards_images` | File | No | Center images (multiple) |

**section5_cards Format:**
```json
[
  {
    "name": "Hyderabad",
    "address": "Ameerpet, Hyderabad"
  },
  {
    "name": "Delhi",
    "address": "Rajouri Garden, Delhi"
  }
]
```

#### Section 6: Our Story
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `section6_title` | Text | No | Section title |
| `section6_description` | Text | No | Main description |
| `section6_subDescription` | Text | No | Sub description |
| `section6_image` | File | No | Story image |
| `section6_stats` | JSON String | No | Array of statistics |

**section6_stats Format:**
```json
[
  {
    "number": "50,000+",
    "text": "Students"
  },
  {
    "number": "500+",
    "text": "Selections"
  },
  {
    "number": "15+",
    "text": "Years"
  }
]
```

### Testing with Postman

1. **Method:** POST
2. **URL:** `http://localhost:5000/api/homepage`
3. **Headers:**
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```
4. **Body:** Select `form-data`

**Example FormData:**

| Key | Value | Type |
|-----|-------|------|
| `section2_text` | India's Best IAS Coaching | Text |
| `section2_iconImage` | [Select File] | File |
| `section2_backgroundImage` | [Select File] | File |
| `section3_title` | OUR TOPPERS | Text |
| `section3_subTitle` | Celebrating Success Stories | Text |
| `section3_toppers` | `[{"name":"Darshan Kumar","rank":"AIR 08","description":"GS Foundation"}]` | Text |
| `section3_toppers_images` | [Select File] | File |
| `section4_title` | OUR LEARNING PROGRAMS | Text |
| `section4_subSections` | `[{"title":"Foundation","description":"UPSC Prep","images":[]}]` | Text |
| `section5_title` | OUR CENTRES | Text |
| `section5_cards` | `[{"name":"Hyderabad"},{"name":"Delhi"}]` | Text |
| `section5_cards_images` | [Select File] | File |
| `section5_cards_images` | [Select File] | File |
| `section6_title` | OUR STORY | Text |
| `section6_description` | 15+ years of excellence | Text |
| `section6_image` | [Select File] | File |
| `section6_stats` | `[{"number":"50,000+","text":"Students"}]` | Text |

### Response

```json
{
  "success": true,
  "message": "HomePage created successfully",
  "data": {
    "_id": "...",
    "section2": { ... },
    "section3": { ... },
    "section4": { ... },
    "section5": { ... },
    "section6": { ... },
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Testing with cURL

```bash
curl -X POST http://localhost:5000/api/homepage \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "section2_text=India's Best IAS Coaching" \
  -F "section2_iconImage=@/path/to/icon.jpg" \
  -F "section2_backgroundImage=@/path/to/bg.jpg" \
  -F "section3_title=OUR TOPPERS" \
  -F 'section3_toppers=[{"name":"Darshan Kumar","rank":"AIR 08"}]' \
  -F "section3_toppers_images=@/path/to/topper.jpg"
```

---

## 3. Home Video Management

Separate API for managing home page videos (section7).

### 3.1 Create Video

**Endpoint:** `POST /home-videos`

**Access:** Private (Super Admin only)

**Authentication Required:** Yes

**Content-Type:** `multipart/form-data`

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `videoUrl` | Text | Yes | YouTube/Video URL |
| `videoThumbnail` | File | Yes | Thumbnail image |

#### Testing with Postman

1. **Method:** POST
2. **URL:** `http://localhost:5000/api/home-videos`
3. **Headers:**
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```
4. **Body:** Select `form-data`

| Key | Value | Type |
|-----|-------|------|
| `videoUrl` | https://youtube.com/watch?v=abc123 | Text |
| `videoThumbnail` | [Select File] | File |

#### Response

```json
{
  "success": true,
  "message": "Video created successfully",
  "data": {
    "_id": "69ec...",
    "videoUrl": "https://youtube.com/watch?v=abc123",
    "videoThumbnail": "https://res.cloudinary.com/.../thumb.jpg",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### 3.2 Get All Videos

**Endpoint:** `GET /home-videos`

**Access:** Public

**Description:** Returns all home videos sorted by latest first.

#### Testing with Postman

1. **Method:** GET
2. **URL:** `http://localhost:5000/api/home-videos`

#### Response

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "69ec...",
      "videoUrl": "https://youtube.com/watch?v=abc123",
      "videoThumbnail": "https://res.cloudinary.com/.../thumb1.jpg",
      "createdAt": "...",
      "updatedAt": "..."
    },
    {
      "_id": "69ec...",
      "videoUrl": "https://youtube.com/watch?v=def456",
      "videoThumbnail": "https://res.cloudinary.com/.../thumb2.jpg",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### 3.3 Update Video

**Endpoint:** `PUT /home-videos/:id`

**Access:** Private (Super Admin only)

**Authentication Required:** Yes

**Content-Type:** `multipart/form-data`

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `videoUrl` | Text | No | New video URL |
| `videoThumbnail` | File | No | New thumbnail image |

#### Testing with Postman

1. **Method:** PUT
2. **URL:** `http://localhost:5000/api/home-videos/VIDEO_ID`
3. **Headers:**
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```
4. **Body:** Select `form-data`

| Key | Value | Type |
|-----|-------|------|
| `videoUrl` | https://youtube.com/watch?v=new123 | Text |
| `videoThumbnail` | [Select File] | File |

#### Response

```json
{
  "success": true,
  "message": "Video updated successfully",
  "data": {
    "_id": "69ec...",
    "videoUrl": "https://youtube.com/watch?v=new123",
    "videoThumbnail": "https://res.cloudinary.com/.../new-thumb.jpg",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### 3.4 Delete Video

**Endpoint:** `DELETE /home-videos/:id`

**Access:** Private (Super Admin only)

**Authentication Required:** Yes

#### Testing with Postman

1. **Method:** DELETE
2. **URL:** `http://localhost:5000/api/home-videos/VIDEO_ID`
3. **Headers:**
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```

#### Response

```json
{
  "success": true,
  "message": "Video deleted successfully"
}
```

---

## Complete Code

### Controller: `controllers/homePageController.js`

```javascript
const HomePage = require('../models/HomePage');
const HomeVideo = require('../models/HomeVideo');
const cloudinary = require('../config/cloudinary');

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (file) => {
  if (!file) return null;
  
  try {
    // For multer memory storage, file is in buffer
    if (file.buffer) {
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;
      
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'homepage',
      });
      
      return result.secure_url;
    }
    
    // For file path (if using disk storage)
    if (file.path) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'homepage',
      });
      
      return result.secure_url;
    }
    
    return null;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
};

// @desc    Save/Update HomePage (Create if not exists, else update)
// @route   POST /api/homepage
// @access  Private (Super Admin only)
exports.saveHomePage = async (req, res) => {
  try {
    const data = {};

    // Section 1: Video Tutorial
    if (req.body.section1_videoUrl) {
      data.section1 = {
        videoUrl: req.body.section1_videoUrl
      };
    }

    // Section 2: Hero
    if (req.body.section2_text || req.body.section2_iconImage || req.body.section2_backgroundImage) {
      data.section2 = {};
      if (req.body.section2_text) data.section2.text = req.body.section2_text;
      
      const iconFile = req.files.find(f => f.fieldname === 'section2_iconImage');
      if (iconFile) {
        data.section2.iconImage = await uploadToCloudinary(iconFile);
      } else if (req.body.section2_iconImage) {
        data.section2.iconImage = req.body.section2_iconImage;
      }
      
      const bgFile = req.files.find(f => f.fieldname === 'section2_backgroundImage');
      if (bgFile) {
        data.section2.backgroundImage = await uploadToCloudinary(bgFile);
      } else if (req.body.section2_backgroundImage) {
        data.section2.backgroundImage = req.body.section2_backgroundImage;
      }
    }

    // Section 3: Toppers
    if (req.body.section3_title || req.body.section3_subTitle) {
      data.section3 = {};
      if (req.body.section3_title) data.section3.title = req.body.section3_title;
      if (req.body.section3_subTitle) data.section3.subTitle = req.body.section3_subTitle;
      
      if (req.body.section3_toppers) {
        try {
          data.section3.toppers = JSON.parse(req.body.section3_toppers);
          
          const topperFiles = req.files.filter(f => f.fieldname === 'section3_toppers_images');
          if (topperFiles.length > 0) {
            const uploadedUrls = [];
            for (const file of topperFiles) {
              const url = await uploadToCloudinary(file);
              uploadedUrls.push(url);
            }
            
            data.section3.toppers = data.section3.toppers.map((topper, index) => {
              if (uploadedUrls[index] && !topper.image) {
                return {
                  ...topper,
                  image: uploadedUrls[index]
                };
              }
              return topper;
            });
          }
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: 'Invalid toppers data format'
          });
        }
      }
    }

    // Section 4: Learning Sections
    if (req.body.section4_title || req.body.section4_subSections) {
      data.section4 = {};
      if (req.body.section4_title) data.section4.title = req.body.section4_title;
      
      if (req.body.section4_subSections) {
        try {
          data.section4.subSections = JSON.parse(req.body.section4_subSections);
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: 'Invalid subSections data format'
          });
        }
      }
    }

    // Section 5: Centres
    if (req.body.section5_title || req.body.section5_cards) {
      data.section5 = {};
      if (req.body.section5_title) data.section5.title = req.body.section5_title;
      
      if (req.body.section5_cards) {
        try {
          data.section5.cards = JSON.parse(req.body.section5_cards);
          
          const cardFiles = req.files.filter(f => f.fieldname === 'section5_cards_images');
          if (cardFiles.length > 0) {
            const uploadedUrls = [];
            for (const file of cardFiles) {
              const url = await uploadToCloudinary(file);
              uploadedUrls.push(url);
            }
            
            data.section5.cards = data.section5.cards.map((card, index) => {
              if (uploadedUrls[index] && !card.image) {
                return {
                  ...card,
                  image: uploadedUrls[index]
                };
              }
              return card;
            });
          }
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: 'Invalid cards data format'
          });
        }
      }
    }

    // Section 6: Story
    if (req.body.section6_title || req.body.section6_description || req.body.section6_subDescription || req.body.section6_stats) {
      data.section6 = {};
      if (req.body.section6_title) data.section6.title = req.body.section6_title;
      if (req.body.section6_description) data.section6.description = req.body.section6_description;
      if (req.body.section6_subDescription) data.section6.subDescription = req.body.section6_subDescription;
      
      const storyFile = req.files.find(f => f.fieldname === 'section6_image');
      if (storyFile) {
        data.section6.image = await uploadToCloudinary(storyFile);
      } else if (req.body.section6_image) {
        data.section6.image = req.body.section6_image;
      }
      
      if (req.body.section6_stats) {
        try {
          data.section6.stats = JSON.parse(req.body.section6_stats);
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: 'Invalid stats data format'
          });
        }
      }
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No data provided to update'
      });
    }

    let home = await HomePage.findOne();

    if (home) {
      home = await HomePage.findByIdAndUpdate(
        home._id,
        { $set: data },
        { new: true, runValidators: true }
      );
      
      res.json({
        success: true,
        message: 'HomePage updated successfully',
        data: home
      });
    } else {
      home = await HomePage.create(data);
      
      res.status(201).json({
        success: true,
        message: 'HomePage created successfully',
        data: home
      });
    }
  } catch (err) {
    console.error('Save HomePage Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error saving HomePage',
      error: err.message 
    });
  }
};

// @desc    Get HomePage data
// @route   GET /api/homepage
// @access  Public
exports.getHomePage = async (req, res) => {
  try {
    const home = await HomePage.findOne();

    if (!home) {
      return res.status(404).json({
        success: false,
        message: 'HomePage not configured yet'
      });
    }

    // Get videos from HomeVideo collection
    const videos = await HomeVideo.find().sort({ createdAt: -1 });

    // Convert to plain object and add section7 with videos
    const homeData = home.toObject();
    homeData.section7 = {
      videos: videos.map(video => ({
        _id: video._id,
        videoUrl: video.videoUrl,
        videoThumbnail: video.videoThumbnail
      }))
    };

    res.json({
      success: true,
      data: homeData
    });
  } catch (err) {
    console.error('Get HomePage Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching HomePage',
      error: err.message 
    });
  }
};
```

### Controller: `controllers/homeVideoController.js`

```javascript
const HomeVideo = require('../models/HomeVideo');
const cloudinary = require('../config/cloudinary');

// Helper function to upload to Cloudinary
const uploadToCloudinary = async (file) => {
  if (!file) return null;
  
  try {
    if (file.buffer) {
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;
      
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'home-videos',
      });
      
      return result.secure_url;
    }
    
    if (file.path) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'home-videos',
      });
      
      return result.secure_url;
    }
    
    return null;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
};

// @desc    Create home video
// @route   POST /api/home-videos
// @access  Private (Super Admin only)
exports.createVideo = async (req, res) => {
  try {
    const { videoUrl } = req.body;
    
    const thumbnailFile = req.files.find(f => f.fieldname === 'videoThumbnail');
    if (!thumbnailFile) {
      return res.status(400).json({
        success: false,
        message: 'videoThumbnail file is required'
      });
    }
    
    const videoThumbnail = await uploadToCloudinary(thumbnailFile);
    
    const video = await HomeVideo.create({
      videoUrl,
      videoThumbnail
    });
    
    res.status(201).json({
      success: true,
      message: 'Video created successfully',
      data: video
    });
  } catch (err) {
    console.error('Create Video Error:', err);
    res.status(500).json({
      success: false,
      message: 'Error creating video',
      error: err.message
    });
  }
};

// @desc    Get all home videos
// @route   GET /api/home-videos
// @access  Public
exports.getVideos = async (req, res) => {
  try {
    const videos = await HomeVideo.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (err) {
    console.error('Get Videos Error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching videos',
      error: err.message
    });
  }
};

// @desc    Update home video
// @route   PUT /api/home-videos/:id
// @access  Private (Super Admin only)
exports.updateVideo = async (req, res) => {
  try {
    const video = await HomeVideo.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    
    const updates = {};
    
    if (req.body.videoUrl) {
      updates.videoUrl = req.body.videoUrl;
    }
    
    const thumbnailFile = req.files.find(f => f.fieldname === 'videoThumbnail');
    if (thumbnailFile) {
      // Delete old thumbnail from Cloudinary
      if (video.videoThumbnail) {
        const publicId = video.videoThumbnail.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`home-videos/${publicId}`);
      }
      
      updates.videoThumbnail = await uploadToCloudinary(thumbnailFile);
    }
    
    const updatedVideo = await HomeVideo.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Video updated successfully',
      data: updatedVideo
    });
  } catch (err) {
    console.error('Update Video Error:', err);
    res.status(500).json({
      success: false,
      message: 'Error updating video',
      error: err.message
    });
  }
};

// @desc    Delete home video
// @route   DELETE /api/home-videos/:id
// @access  Private (Super Admin only)
exports.deleteVideo = async (req, res) => {
  try {
    const video = await HomeVideo.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    
    // Delete thumbnail from Cloudinary
    if (video.videoThumbnail) {
      const publicId = video.videoThumbnail.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`home-videos/${publicId}`);
    }
    
    await HomeVideo.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (err) {
    console.error('Delete Video Error:', err);
    res.status(500).json({
      success: false,
      message: 'Error deleting video',
      error: err.message
    });
  }
};
```

### Routes: `routes/homePageRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, authorize } = require('../middleware/authMiddleware');

const {
  saveHomePage,
  getHomePage
} = require('../controllers/homePageController');

const {
  createVideo,
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

// Home Page Routes
router.get('/', getHomePage);
router.post('/', protect, authorize('super_admin'), upload.any(), saveHomePage);

// Home Video Routes
router.route('/home-videos')
  .get(getVideos)
  .post(protect, authorize('super_admin'), upload.any(), createVideo);

router.route('/home-videos/:id')
  .put(protect, authorize('super_admin'), upload.any(), updateVideo)
  .delete(protect, authorize('super_admin'), deleteVideo);

module.exports = router;
```

### Model: `models/HomePage.js`

```javascript
const mongoose = require('mongoose');

const homePageSchema = new mongoose.Schema({
  section1: {
    videoUrl: String
  },
  section2: {
    iconImage: String,
    text: String,
    backgroundImage: String
  },
  section3: {
    title: String,
    subTitle: String,
    toppers: [{
      image: String,
      name: String,
      rank: String,
      description: String
    }]
  },
  section4: {
    title: String,
    subSections: [{
      title: String,
      description: String,
      images: [String]
    }]
  },
  section5: {
    title: String,
    cards: [{
      image: String,
      name: String
    }]
  },
  section6: {
    title: String,
    image: String,
    description: String,
    subDescription: String,
    stats: [{
      number: String,
      text: String
    }]
  },
  section7: {
    videos: [] // Fetched from HomeVideo collection
  }
}, { timestamps: true });

module.exports = mongoose.model('HomePage', homePageSchema);
```

### Model: `models/HomeVideo.js`

```javascript
const mongoose = require('mongoose');

const homeVideoSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: true,
    trim: true
  },
  videoThumbnail: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('HomeVideo', homeVideoSchema);
```

---

## Quick Testing Checklist

### 1. Get Home Page
```bash
GET http://localhost:5000/api/homepage
```
✅ Should return all sections including videos in section7

### 2. Create/Update Home Page
```bash
POST http://localhost:5000/api/homepage
Authorization: Bearer TOKEN
Content-Type: multipart/form-data
```
✅ Upload images and JSON data for all sections

### 3. Create Video
```bash
POST http://localhost:5000/api/home-videos
Authorization: Bearer TOKEN
FormData:
- videoUrl: https://youtube.com/watch?v=abc123
- videoThumbnail: [File]
```
✅ Video created and stored in HomeVideo collection

### 4. Get All Videos
```bash
GET http://localhost:5000/api/home-videos
```
✅ Returns all videos

### 5. Update Video
```bash
PUT http://localhost:5000/api/home-videos/VIDEO_ID
Authorization: Bearer TOKEN
FormData:
- videoUrl: https://youtube.com/watch?v=new123
- videoThumbnail: [File] (optional)
```
✅ Video updated

### 6. Delete Video
```bash
DELETE http://localhost:5000/api/home-videos/VIDEO_ID
Authorization: Bearer TOKEN
```
✅ Video deleted

### 7. Verify Videos in Home Page
```bash
GET http://localhost:5000/api/homepage
```
✅ section7.videos should contain all videos from HomeVideo collection

---

## Notes

- **Section 7 (Videos)** is managed through a separate API (`/home-videos`)
- Videos are automatically included in the homepage response
- All file uploads go to Cloudinary
- Only Super Admin can create/update/delete content
- GET endpoints are public
- Images in FormData use field naming conventions: `section2_iconImage`, `section3_toppers_images`, etc.
- JSON arrays must be stringified when sending in FormData
