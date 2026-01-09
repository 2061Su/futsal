const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/User'); // <--- ADD THIS IMPORT

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// 1. GET User Data (to show current info on the Profile page)
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['name', 'email', 'phone', 'role'] // Exclude password for security
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. UPDATE User Profile (Phone number)
router.put('/profile/:id', async (req, res) => {
  try {
    const { phone, name } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.phone = phone || user.phone;
    user.name = name || user.name;
    await user.save();

    res.json({ message: "Profile updated!", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;