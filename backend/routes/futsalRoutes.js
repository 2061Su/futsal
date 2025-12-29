const express = require('express');
const router = express.Router();
const Futsal = require('../models/Futsal');


router.get('/', async (req, res) => {
  try {
    const futsals = await Futsal.findAll();
    console.log("Futsals found:", futsals); 
    res.json(futsals); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/add', async (req, res) => {
  try {
    const newFutsal = await Futsal.create(req.body);
    res.status(201).json(newFutsal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


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