const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  public_id: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'General',
    enum: ['General', 'Puppies', 'Dogs', 'Cats', 'Events', 'Facilities']
  },
  caption: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Gallery', gallerySchema);
