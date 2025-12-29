const express = require('express');
const router = express.Router();
const Futsal = require('../models/Futsal');

// GET all futsals
router.get('/', async (req, res) => {
  try {
    const futsals = await Futsal.findAll();
    res.json(futsals); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Add one or many futsals
router.post('/add', async (req, res) => {
  try {
    const { name, location, openingTime, closingTime, contact, pricePerHour, ownerId } = req.body;

    // Check if this owner already has a futsal (if you want 1 owner = 1 futsal)
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
      ownerId: parseInt(ownerId) // Link it to the logged-in user
    });

    res.status(201).json(newFutsal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET futsal by ID
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