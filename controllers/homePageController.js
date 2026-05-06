const HomePage = require('../models/HomePage');
const HomeVideo = require('../models/HomeVideo');
const HomeSection4 = require('../models/HomeSection4');
const Course = require('../models/Course');
const Book = require('../models/Book');
const cloudinary = require('../config/cloudinary');

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (file) => {
  if (!file) return null;
  
  try {
    // For multer memory storage, file is in buffer
    if (file.buffer) {
      // Convert buffer to base64
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

    // Parse section data from req.body
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
      
      // Upload icon image if provided
      const iconFile = req.files.find(f => f.fieldname === 'section2_iconImage');
      if (iconFile) {
        data.section2.iconImage = await uploadToCloudinary(iconFile);
      } else if (req.body.section2_iconImage) {
        data.section2.iconImage = req.body.section2_iconImage;
      }
      
      // Upload background image if provided
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
      
      // Parse toppers array
      if (req.body.section3_toppers) {
        try {
          data.section3.toppers = JSON.parse(req.body.section3_toppers);
          
          // Upload topper images if files provided
          const topperFiles = req.files.filter(f => f.fieldname === 'section3_toppers_images');
          if (topperFiles.length > 0) {
            // Upload all images first
            const uploadedUrls = [];
            for (const file of topperFiles) {
              const url = await uploadToCloudinary(file);
              uploadedUrls.push(url);
            }
            
            // Assign URLs to toppers
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
          
          // Upload centre images if files provided
          const cardFiles = req.files.filter(f => f.fieldname === 'section5_cards_images');
          if (cardFiles.length > 0) {
            // Upload all images first
            const uploadedUrls = [];
            for (const file of cardFiles) {
              const url = await uploadToCloudinary(file);
              uploadedUrls.push(url);
            }
            
            // Assign URLs to cards
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
      
      // Upload story image if provided
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

    // Note: Section 7 (Videos) has been moved to separate API: /api/home-videos

    // Check if any data to update
    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No data provided to update'
      });
    }

    // Find existing homepage or create new
    let home = await HomePage.findOne();

    if (home) {
      // Update existing document using $set
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
      // Create new document
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

    // Get section4 cards from HomeSection4 collection
    const section4Cards = await HomeSection4.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });

    // Get courses grouped by category
    const courses = await Course.find({ isActive: true })
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    // Group courses by category
    const groupedCourses = {};

    courses.forEach(course => {
      const categoryName = course.category?.name || 'Uncategorized';

      if (!groupedCourses[categoryName]) {
        groupedCourses[categoryName] = [];
      }

      groupedCourses[categoryName].push({
        _id: course._id,
        title: course.title,
        bannerImage: course.bannerImage?.url || null
      });
    });

    // Convert to frontend format
    const courseSection = {
      title: 'EXPLORE OUR COURSES',
      categories: Object.keys(groupedCourses).map(category => ({
        name: category,
        courses: groupedCourses[category]
      }))
    };

    // Get books for homepage
    const books = await Book.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(10);

    // Format books with required fields
    const formattedBooks = books.map(book => ({
      _id: book._id,
      image: book.image?.url || null,
      title: book.title,
      discountedPrice: book.discountedPrice,
      summary: book.summary?.substring(0, 100) || ''
    }));

    // Books section for homepage
    const bookSection = {
      title: 'BUY OUR BOOKS',
      books: formattedBooks
    };

    // Convert to plain object and add section4 and section7
    const homeData = home.toObject();
    
    // Add section4 with cards
    homeData.section4 = {
      title: homeData.section4?.title || 'ACCESS FREE LEARNING COURSES',
      cards: section4Cards
    };

    // Add section7 with videos
    homeData.section7 = {
      videos: videos.map(video => ({
        _id: video._id,
        videoUrl: video.videoUrl,
        videoThumbnail: video.videoThumbnail
      }))
    };

    // Add sectionCourses with grouped courses by category
    homeData.sectionCourses = courseSection;

    // Add sectionBooks with formatted books
    homeData.sectionBooks = bookSection;

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
