const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/User'); 

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);


router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['name', 'email', 'phone', 'role']
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


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