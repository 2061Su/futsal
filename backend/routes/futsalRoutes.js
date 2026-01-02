const express = require('express');
const router = express.Router();
const Futsal = require('../models/Futsal');
const { upload } = require('../config/cloudinary');

// 1. GET ALL (Must be at the TOP)
router.get('/all', async (req, res) => {
  try {
    const futsals = await Futsal.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(futsals);
  } catch (err) {
    console.error("SERVER ERROR on /all:", err);
    res.status(500).json({ message: err.message });
  }
});

// 2. GET APPROVED ONLY (For the main player list)
router.get('/', async (req, res) => {
  try {
    const futsals = await Futsal.findAll({ where: { status: 'Approved' } });
    res.json(futsals); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. POST - Add new ground
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name, location, openingTime, closingTime, contact, pricePerHour, ownerId } = req.body;

    // Check if owner already has a ground
    const existing = await Futsal.findOne({ where: { ownerId } });
    if (existing) {
      return res.status(400).json({ message: "You already have a futsal registered." });
    }

    // Get the image path from Cloudinary (provided by multer)
    const imageUrl = req.file ? req.file.path : 'https://via.placeholder.com/400x250?text=No+Image+Available';

    const newFutsal = await Futsal.create({
      name,
      location,
      openingTime,
      closingTime,
      contact,
      // Use Number() to safely handle strings or empty values
      pricePerHour: Number(pricePerHour) || 0, 
      ownerId: Number(ownerId),
      imageUrl: imageUrl,
      status: 'Pending' 
    });

    res.status(201).json(newFutsal);
  } catch (err) {
    console.error("Error creating futsal:", err);
    res.status(400).json({ message: err.message });
  }
});

router.get('/owner/:ownerId', async (req, res) => {
  try {
    const futsal = await Futsal.findOne({ where: { ownerId: req.params.ownerId } });
    if (!futsal) return res.status(404).json({ message: "No futsal found for this owner." });
    res.json(futsal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- NEW: UPDATE GROUND (For Profile.jsx) ---
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, location, openingTime, closingTime, contact, pricePerHour } = req.body;
    const futsal = await Futsal.findByPk(req.params.id);
    
    if (!futsal) return res.status(404).json({ message: "Futsal not found" });

    // Update basic fields
    futsal.name = name || futsal.name;
    futsal.location = location || futsal.location;
    futsal.openingTime = openingTime || futsal.openingTime;
    futsal.closingTime = closingTime || futsal.closingTime;
    futsal.contact = contact || futsal.contact;
    futsal.pricePerHour = pricePerHour || futsal.pricePerHour;

    // If a new image is uploaded, update the Cloudinary URL
    if (req.file) {
      futsal.imageUrl = req.file.path;
      // Important: If details or photos change, you might want to reset status to Pending
      futsal.status = 'Pending'; 
    }

    await futsal.save();
    res.json(futsal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- NEW: DELETE GROUND (For Profile.jsx) ---
router.delete('/:id', async (req, res) => {
  try {
    const futsal = await Futsal.findByPk(req.params.id);
    if (!futsal) return res.status(404).json({ message: "Futsal not found" });

    await futsal.destroy();
    res.json({ message: "Futsal deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. PATCH - Verify (Admin Approval)
router.patch('/verify/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const futsal = await Futsal.findByPk(req.params.id);
    if (!futsal) return res.status(404).json({ message: "Futsal not found" });
    
    futsal.status = status;
    await futsal.save();
    res.json(futsal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. GET BY ID (Must be at the BOTTOM)
router.get('/:id', async (req, res) => {
  try {
    const futsal = await Futsal.findByPk(req.params.id);
    if (!futsal) return res.status(404).json({ message: "Futsal not found" });
    res.json(futsal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;