const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth');

// Use env secret or a hardcoded fallback so it works without .env
const JWT_SECRET = process.env.JWT_SECRET || 'chaitanya_pets_secret_key_2024_fallback';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username and password' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

    res.json({
      success: true,
      token,
      admin: { id: admin._id, username: admin.username }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// POST /api/auth/setup - Creates admin if seed wasn't run
router.post('/setup', async (req, res) => {
  try {
    const existing = await Admin.findOne({});
    if (existing) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }
    const admin = await Admin.create({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'chaitanya2024'
    });
    res.json({ success: true, message: 'Admin created', username: admin.username });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
