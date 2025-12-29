const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Futsal = require('../models/Futsal');
const User = require('../models/User');



router.get('/user/:userId', async (req, res) => {
  let { userId } = req.params;
  
  // If the frontend sends the string "undefined", this fails
  if (!userId || userId === "undefined" || userId === "null") {
    return res.status(400).json({ message: "Valid User ID is required" });
  }

  try {
    const bookings = await Booking.findAll({
      where: { userId: Number(userId) }, // Use Number() for safety
      include: [{ model: Futsal }]
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', async (req, res) => {
  console.log("--- BOOKING ATTEMPT ---");
  console.log("Data received:", req.body); // Check if userId is here
  
  try {
    const { futsalId, date, timeSlot, userId } = req.body;
    
    // Log specifically what is being sent to the create method
    const newBooking = await Booking.create({
      futsalId: parseInt(futsalId),
      userId: userId ? parseInt(userId) : null, // Catch null IDs
      date,
      timeSlot,
      status: 'Pending'
    });
    
    console.log("Successfully saved booking ID:", newBooking.id, "for User:", newBooking.userId);
    res.status(201).json(newBooking);
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ message: err.message });
  }
});


// 1. GET all bookings (Admin view)
router.get('/', async (req, res) => {
  
  try {
    const allBookings = await Booking.findAll({
      include: [Futsal, User], // Join both so admin sees WHO booked WHICH court
      order: [['createdAt', 'DESC']] // Newest requests first
    });
    res.json(allBookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. UPDATE booking status (Approve/Reject)
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body; // Expecting 'Confirmed' or 'Rejected'
    const booking = await Booking.findByPk(req.params.id);
    
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    await booking.save();

    res.json({ message: `Booking ${status}`, booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel/Delete Booking
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