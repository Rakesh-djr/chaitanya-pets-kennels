const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME &&
                      process.env.CLOUDINARY_API_KEY &&
                      process.env.CLOUDINARY_API_SECRET;

// Helper to get image object from file
const getImageObj = (file) => {
  if (useCloudinary) {
    return { url: file.path, public_id: file.filename };
  }
  return { url: `/uploads/${file.filename}`, public_id: file.filename };
};

// GET /api/pets
router.get('/', async (req, res) => {
  try {
    const { breed, status, minPrice, maxPrice, limit = 50 } = req.query;
    const filter = {};
    if (breed) filter.breed = new RegExp(breed, 'i');
    if (status) filter.status = status;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const pets = await Pet.find(filter).sort({ createdAt: -1 }).limit(Number(limit));
    res.json({ success: true, count: pets.length, pets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/pets/breeds
router.get('/breeds', async (req, res) => {
  try {
    const breeds = await Pet.distinct('breed');
    res.json({ success: true, breeds });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/pets/stats
router.get('/stats', protect, async (req, res) => {
  try {
    const total = await Pet.countDocuments();
    const available = await Pet.countDocuments({ status: 'Available' });
    const sold = await Pet.countDocuments({ status: 'Sold' });
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const petsOverTime = await Pet.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json({ success: true, stats: { total, available, sold }, petsOverTime });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/pets/:id
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ success: false, message: 'Pet not found' });
    const recommendations = await Pet.find({
      _id: { $ne: pet._id },
      $or: [{ breed: pet.breed }, { price: { $gte: pet.price * 0.7, $lte: pet.price * 1.3 } }],
      status: 'Available'
    }).limit(4);
    res.json({ success: true, pet, recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/pets
router.post('/', protect, upload.array('images', 10), async (req, res) => {
  try {
    const { name, breed, price, description, status, age, gender, vaccinated, features } = req.body;
    const images = req.files ? req.files.map(getImageObj) : [];
    const pet = await Pet.create({
      name, breed, price: Number(price), description,
      status: status || 'Available',
      age: age || '',
      gender: gender || 'Unknown',
      vaccinated: vaccinated === 'true' || vaccinated === true,
      features: features ? (Array.isArray(features) ? features : features.split(',').map(f => f.trim()).filter(Boolean)) : [],
      images
    });
    res.status(201).json({ success: true, pet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/pets/:id
router.put('/:id', protect, upload.array('images', 10), async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ success: false, message: 'Pet not found' });
    const updates = { ...req.body };
    if (updates.price) updates.price = Number(updates.price);
    if (updates.vaccinated !== undefined) updates.vaccinated = updates.vaccinated === 'true' || updates.vaccinated === true;
    if (updates.features) {
      updates.features = Array.isArray(updates.features)
        ? updates.features
        : updates.features.split(',').map(f => f.trim()).filter(Boolean);
    }
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(getImageObj);
      updates.images = [...pet.images, ...newImages];
    }
    const updatedPet = await Pet.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json({ success: true, pet: updatedPet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/pets/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ success: false, message: 'Pet not found' });
    res.json({ success: true, message: 'Pet deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
