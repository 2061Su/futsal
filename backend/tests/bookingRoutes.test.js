const request = require('supertest');
const express = require('express');
const bookingRoutes = require('../routes/bookingRoutes'); // Path to your route file
const Booking = require('../models/Booking');

// Mock the models
jest.mock('../models/Booking');
jest.mock('../models/Futsal');
jest.mock('../models/User');

const app = express();
app.use(express.json());
app.use('/bookings', bookingRoutes);

describe('Booking Routes Integration Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Get User Bookings
  describe('GET /bookings/user/:userId', () => {
    test('should return 400 if userId is invalid', async () => {
      const res = await request(app).get('/bookings/user/undefined');
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Valid User ID is required");
    });

    test('should return bookings for a valid user', async () => {
      const mockData = [{ id: 1, date: '2026-05-20', Futsal: { name: 'City Futsal' } }];
      Booking.findAll.mockResolvedValue(mockData);

      const res = await request(app).get('/bookings/user/1');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].id).toBe(1);
    });
  });

  // Test 2: Create Booking (The conflict check logic)
  describe('POST /bookings', () => {
    const newBookingData = {
      futsalId: 1,
      userId: 2,
      date: '2026-06-01',
      timeSlot: '5pm-6pm',
      phone: '9841000000'
    };

    test('should create booking if no conflict exists', async () => {
      Booking.findOne.mockResolvedValue(null); // No conflict found
      Booking.create.mockResolvedValue({ id: 99, ...newBookingData, status: 'Pending' });

      const res = await request(app)
        .post('/bookings')
        .send(newBookingData);

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('Pending');
    });

    test('should block booking if slot is already confirmed', async () => {
      Booking.findOne.mockResolvedValue({ id: 10, status: 'Confirmed' }); // Conflict found

      const res = await request(app)
        .post('/bookings')
        .send(newBookingData);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain("already booked and confirmed");
    });
  });

  // Test 3: Update Status
  describe('PATCH /bookings/:id', () => {
    test('should update booking status successfully', async () => {
      const mockBooking = { 
        id: 1, 
        status: 'Pending', 
        save: jest.fn().mockResolvedValue(true) 
      };
      Booking.findByPk.mockResolvedValue(mockBooking);

      const res = await request(app)
        .patch('/bookings/1')
        .send({ status: 'Confirmed' });

      expect(res.statusCode).toBe(200);
      expect(mockBooking.status).toBe('Confirmed');
    });
  });
});