const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');

// GET /api/pets - Get all pets with filters
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

// GET /api/pets/breeds - Get unique breeds
router.get('/breeds', async (req, res) => {
  try {
    const breeds = await Pet.distinct('breed');
    res.json({ success: true, breeds });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/pets/stats - Dashboard stats
router.get('/stats', protect, async (req, res) => {
  try {
    const total = await Pet.countDocuments();
    const available = await Pet.countDocuments({ status: 'Available' });
    const sold = await Pet.countDocuments({ status: 'Sold' });

    // Pets added over time (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const petsOverTime = await Pet.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
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

    // Get recommendations: same breed or similar price
    const recommendations = await Pet.find({
      _id: { $ne: pet._id },
      $or: [
        { breed: pet.breed },
        { price: { $gte: pet.price * 0.7, $lte: pet.price * 1.3 } }
      ],
      status: 'Available'
    }).limit(4);

    res.json({ success: true, pet, recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/pets - Add pet (Admin)
router.post('/', protect, upload.array('images', 10), async (req, res) => {
  try {
    const { name, breed, price, description, status, age, gender, vaccinated, features } = req.body;
    
    const images = req.files ? req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      public_id: file.filename
    })) : [];

    // Parse images if sent as JSON strings
    let extraImages = [];
    if (req.body.imageUrls) {
      try {
        extraImages = JSON.parse(req.body.imageUrls).map(url => ({ url, public_id: '' }));
      } catch {}
    }

    const pet = await Pet.create({
      name, breed, price: Number(price), description, status,
      age: age || '', gender: gender || 'Unknown',
      vaccinated: vaccinated === 'true',
      features: features ? JSON.parse(features) : [],
      images: [...images, ...extraImages]
    });

    res.status(201).json({ success: true, pet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/pets/:id - Update pet (Admin)
router.put('/:id', protect, upload.array('images', 10), async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ success: false, message: 'Pet not found' });

    const updates = { ...req.body };
    if (updates.price) updates.price = Number(updates.price);
    if (updates.vaccinated) updates.vaccinated = updates.vaccinated === 'true';
    if (updates.features) {
      try { updates.features = JSON.parse(updates.features); } catch { updates.features = []; }
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        public_id: file.filename
      }));
      updates.images = [...pet.images, ...newImages];
    }

    const updatedPet = await Pet.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json({ success: true, pet: updatedPet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/pets/:id (Admin)
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
