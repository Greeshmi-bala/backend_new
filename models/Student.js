const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parentName: {
    type: String,
    required: true
  },
  parentMobile: {
    type: String,
    required: true
  },
  parentEmail: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
