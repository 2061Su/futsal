const request = require('supertest');
const express = require('express');
const bookingRoutes = require('../routes/bookingRoutes'); 
const Booking = require('../models/Booking');


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

 
  describe('POST /bookings', () => {
    const newBookingData = {
      futsalId: 1,
      userId: 2,
      date: '2026-06-01',
      timeSlot: '5pm-6pm',
      phone: '9841000000'
    };

    test('should create booking if no conflict exists', async () => {
      Booking.findOne.mockResolvedValue(null); 
      Booking.create.mockResolvedValue({ id: 99, ...newBookingData, status: 'Pending' });

      const res = await request(app)
        .post('/bookings')
        .send(newBookingData);

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('Pending');
    });

    test('should block booking if slot is already confirmed', async () => {
      Booking.findOne.mockResolvedValue({ id: 10, status: 'Confirmed' }); 

      const res = await request(app)
        .post('/bookings')
        .send(newBookingData);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain("already booked and confirmed");
    });
  });

 
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

  
  describe('PUT /bookings/:id', () => {
    test('should reschedule a booking and update date/time', async () => {
      const mockBooking = { 
        id: 25, 
        date: '2026-05-20', 
        timeSlot: '06:00 AM - 07:00 AM',
        save: jest.fn().mockResolvedValue(true) 
      };
      Booking.findByPk.mockResolvedValue(mockBooking);

      const updateData = { 
        date: '2026-05-21', 
        timeSlot: '08:00 PM - 09:00 PM' 
      };

      const res = await request(app)
        .put('/bookings/25')
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(mockBooking.date).toBe('2026-05-21');
      expect(mockBooking.timeSlot).toBe('08:00 PM - 09:00 PM');
      expect(res.body.message).toBe("Booking updated successfully");
    });

    test('should return 404 if booking to update does not exist', async () => {
      Booking.findByPk.mockResolvedValue(null);
      const res = await request(app).put('/bookings/999').send({ date: '2026-01-01' });
      expect(res.statusCode).toBe(404);
    });
  });

  
  describe('DELETE /bookings/:id', () => {
    test('should delete a booking successfully', async () => {
      Booking.destroy.mockResolvedValue(1); 

      const res = await request(app).delete('/bookings/1');
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Booking removed successfully");
    });

    test('should return 404 if booking to delete is not found', async () => {
      Booking.destroy.mockResolvedValue(0); 
      const res = await request(app).delete('/bookings/999');
      expect(res.statusCode).toBe(404);
    });
  });
});