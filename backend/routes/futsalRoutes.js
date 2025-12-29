const express = require('express');
const router = express.Router();
const Futsal = require('../models/Futsal');

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
router.post('/add', async (req, res) => {
  try {
    const { name, location, openingTime, closingTime, contact, pricePerHour, ownerId } = req.body;

    
    const existing = await Futsal.findOne({ where: { ownerId } });
    if (existing) {
      return res.status(400).json({ message: "You already have a futsal registered." });
    }

    const newFutsal = await Futsal.create({
      name,
      location,
      openingTime,
      closingTime,
      contact,
      pricePerHour,
      ownerId: parseInt(ownerId),
      status: 'Pending' // Default status
    });

    res.status(201).json(newFutsal);
  } catch (err) {
    res.status(400).json({ message: err.message });
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