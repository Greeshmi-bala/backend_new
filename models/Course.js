const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  slug: {
    type: String,
    unique: true,
    sparse: true, // Allows null values but ensures uniqueness when present
    trim: true
  },
  
  center: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Center',
    required: true
  },
  
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  
  description: String,
  
  startDate: {
    type: mongoose.Schema.Types.Mixed, // Can be Date or String (e.g., "Admission open soon")
    default: null
  },
  duration: String, // "1 Year", "2 Years", "6 Months"
  
  fees: {
    online: Number,
    offline: Number,
    description: String
  },
  
  modes: [{
    type: String,
    enum: ['online', 'offline', 'hybrid']
  }],
  
  // Media (Cloudinary URLs)
  bannerImage: {
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  },
  highlightImage: {
    url: String,
    public_id: String
  },
  sectionImage: {
    url: String,
    public_id: String
  },
  
  galleryImages: [{
    url: String,
    public_id: String
  }],
  
  promoVideo: {
    url: String,
    public_id: String
  },
  
  // Content Sections
  keyHighlights: {
    keyTitle: String,
    keyHighlightTexts: [String]
  },
  
  whyChoose: {
    whyChooseTitle: String,
    whyChooseItems: [{
      whyChooseText: String,
      whyChooseContent: String
    }]
  },
  
  howItHelps: {
    howItHelpsTitle: String,
    howItHelpsTexts: [String]
  },
  
  // Extra Fields (Flexible content for category-specific data)
  extraFields: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Additional Info
  brochure: {
    url: String,
    public_id: String
  },
  features: [String],
  
  // Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
  
}, { timestamps: true });

// Generate slug from title before saving
courseSchema.pre('save', async function() {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
});

// Index for faster queries
courseSchema.index({ center: 1, category: 1 });
courseSchema.index({ isActive: 1 });

module.exports = mongoose.model('Course', courseSchema);
