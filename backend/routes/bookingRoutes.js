const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Futsal = require('../models/Futsal');
const User = require('../models/User');

// ==========================================
// 1. ADMIN ROUTE: Get ALL bookings (System Admin Only)
// ==========================================
router.get('/', async (req, res) => {
  try {
    const allBookings = await Booking.findAll({
      include: [
        { model: Futsal, attributes: ['name', 'location'] },
        { model: User, attributes: ['name', 'phone', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(allBookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 2. OWNER ROUTE: Get bookings for a SPECIFIC Futsal
// ==========================================
router.get('/futsal/:futsalId', async (req, res) => {
  try {
    const { futsalId } = req.params;
    const bookings = await Booking.findAll({
      where: { futsalId: futsalId },
      include: [
        { model: User, attributes: ['name', 'phone', 'email'] },
        { model: Futsal, attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 3. PLAYER ROUTE: Get bookings for a SPECIFIC User
// ==========================================
router.get('/user/:userId', async (req, res) => {
  let { userId } = req.params;
  

  if (!userId || userId === "undefined" || userId === "null") {
    return res.status(400).json({ message: "Valid User ID is required" });
  }

  try {
    const bookings = await Booking.findAll({
      where: { userId: Number(userId) },
      include: [{ model: Futsal, attributes: ['name', 'location', 'contact'] }],
      order: [['date', 'DESC']]
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 4. CREATE: Create a new booking
// ==========================================
router.post('/', async (req, res) => {


  try {
    const { futsalId, date, timeSlot, userId } = req.body;
    

    const newBooking = await Booking.create({
      futsalId: parseInt(futsalId),
      userId: userId ? parseInt(userId) : null,
      date,
      timeSlot,
      status: 'Pending'
    });
    

    res.status(201).json(newBooking);


  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 5. UPDATE: Approve or Reject a booking
// ==========================================
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body; // 'Confirmed' or 'Rejected'
    const booking = await Booking.findByPk(req.params.id);
    
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    await booking.save();

    res.json({ message: `Booking ${status}`, booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 6. DELETE: Cancel a booking
// ==========================================
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.destroy();
    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;