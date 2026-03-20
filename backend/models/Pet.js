const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pet name is required'],
    trim: true
  },
  breed: {
    type: String,
    required: [true, 'Breed is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  images: [{
    url: String,
    public_id: String
  }],
  status: {
    type: String,
    enum: ['Available', 'Sold'],
    default: 'Available'
  },
  age: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Unknown'],
    default: 'Unknown'
  },
  vaccinated: {
    type: Boolean,
    default: false
  },
  features: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Pet', petSchema);
