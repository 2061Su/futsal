const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Futsal = require('../models/Futsal');
const User = require('../models/User');

// 1. ADMIN: Get ALL bookings
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

// 2. OWNER: Get bookings for a SPECIFIC Futsal
router.get('/futsal/:futsalId', async (req, res) => {
  try {
    const { futsalId } = req.params;
    const bookings = await Booking.findAll({
      where: { futsalId },
      include: [
        { model: User, attributes: ['name', 'phone'] },
        { model: Futsal, attributes: ['name'] }
      ],
      order: [['date', 'DESC']]
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. PLAYER: Get bookings for a SPECIFIC User
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
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

// 4. CREATE: Add new booking (With Double-Booking Check)
router.post('/', async (req, res) => {

  
  try {
    const { futsalId, date, timeSlot, userId, phone } = req.body;

    // Logic: Block if same futsal + same date + same slot is already 'Confirmed'
    const conflict = await Booking.findOne({
      where: { futsalId, date, timeSlot, status: 'Confirmed' }
    });

    if (conflict) {
      return res.status(400).json({ 
        message: "This slot is already booked and confirmed. Please pick another time." 
      });
    }

    const newBooking = await Booking.create({
      futsalId, userId, date, timeSlot, phone, status: 'Pending'
    });


    res.status(201).json(newBooking);


  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. UPDATE: Status change
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    await booking.save();

    res.json({ message: `Booking ${status}`, booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 6. DELETE: Cancel/Delete
router.delete('/:id', async (req, res) => {
  try {
    const result = await Booking.destroy({ where: { id: req.params.id } });
    if (result === 0) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;