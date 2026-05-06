const mongoose = require('mongoose');

const homePageSchema = new mongoose.Schema({

  // SECTION 1: Video Tutorial
  section1: {
    videoUrl: {
      type: String,
      trim: true
    }
  },

  // SECTION 2: Hero
  section2: {
    iconImage: {
      type: String,
      trim: true
    },
    text: {
      type: String,
      trim: true
    },
    backgroundImage: {
      type: String,
      trim: true
    }
  },

  // SECTION 3: Topper Highlight (Multiple Toppers)
  section3: {
    title: {
      type: String,
      trim: true
    },
    subTitle: {
      type: String,
      trim: true
    },
    toppers: [
      {
        image: {
          type: String,
          trim: true
        },
        name: {
          type: String,
          trim: true
        },
        rank: {
          type: String,
          trim: true
        },
        description: {
          type: String,
          trim: true
        }
      }
    ]
  },

  // SECTION 4: Learning Sections
  section4: {
    title: {
      type: String,
      trim: true
    },
    subSections: [
      {
        title: {
          type: String,
          trim: true
        },
        description: {
          type: String,
          trim: true
        },
        images: [
          {
            type: String,
            trim: true
          }
        ]
      }
    ]
  },

  // SECTION 5: Centres
  section5: {
    title: {
      type: String,
      trim: true
    },
    cards: [
      {
        image: {
          type: String,
          trim: true
        },
        name: {
          type: String,
          trim: true
        }
      }
    ]
  },

  // SECTION 6: Story
  section6: {
    title: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    subDescription: {
      type: String,
      trim: true
    },
    stats: [
      {
        number: {
          type: String,
          trim: true
        },
        text: {
          type: String,
          trim: true
        }
      }
    ]
  },

  // SECTION 7: YouTube Videos
  section7: {
    title: {
      type: String,
      trim: true
    },
    videos: [
      {
        videoUrl: {
          type: String,
          trim: true
        },
        thumbnail: {
          type: String,
          trim: true
        }
      }
    ]
  }

}, { timestamps: true });

module.exports = mongoose.model('HomePage', homePageSchema);
