const request = require('supertest');
const express = require('express');
const futsalRoutes = require('../routes/futsalRoutes');
const Futsal = require('../models/Futsal');

// 1. Mock the Cloudinary/Multer middleware BEFORE requiring the routes
jest.mock('../config/cloudinary', () => ({
  upload: {
    single: () => (req, res, next) => {
      // Simulate a file being uploaded
      if (req.body.simulateUpload) {
        req.file = { path: 'https://cloudinary.com/fake-image.jpg' };
      }
      next();
    },
  },
}));

jest.mock('../models/Futsal');

const app = express();
app.use(express.json());
app.use('/futsals', futsalRoutes);

describe('Futsal Routes Integration Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /futsals/all', () => {
    test('should return all futsals ordered by newest first', async () => {
      const mockFutsals = [{ name: 'Arena A' }, { name: 'Arena B' }];
      Futsal.findAll.mockResolvedValue(mockFutsals);

      const res = await request(app).get('/futsals/all');

      expect(res.statusCode).toBe(200);
      expect(Futsal.findAll).toHaveBeenCalledWith(expect.objectContaining({
        order: [['createdAt', 'DESC']]
      }));
      expect(res.body.length).toBe(2);
    });
  });

  describe('POST /futsals/add', () => {
    test('should return 400 if owner already has a registered futsal', async () => {
      // Simulate owner already having a record
      Futsal.findOne.mockResolvedValue({ id: 1, ownerId: 10 });

      const res = await request(app)
        .post('/futsals/add')
        .send({ ownerId: 10, name: 'New Futsal' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("You already have a futsal registered.");
    });

    test('should create a new futsal with a placeholder image if no file is provided', async () => {
      Futsal.findOne.mockResolvedValue(null); // No existing record
      Futsal.create.mockResolvedValue({ id: 1, name: 'Stadium 5', status: 'Pending' });

      const res = await request(app)
        .post('/futsals/add')
        .send({ name: 'Stadium 5', ownerId: 20 });

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('Pending');
      // Verify placeholder was used in the call
      expect(Futsal.create).toHaveBeenCalledWith(expect.objectContaining({
        imageUrl: 'https://via.placeholder.com/400x250?text=No+Image+Available'
      }));
    });
  });

  describe('PUT /futsals/:id', () => {
    test('should update futsal and reset status to Pending if a new image is uploaded', async () => {
      const mockFutsal = {
        id: 1,
        name: 'Old Name',
        status: 'Approved',
        save: jest.fn().mockResolvedValue(true)
      };
      Futsal.findByPk.mockResolvedValue(mockFutsal);

      const res = await request(app)
        .put('/futsals/1')
        .send({ name: 'New Name', simulateUpload: true });

      expect(res.statusCode).toBe(200);
      expect(mockFutsal.name).toBe('New Name');
      expect(mockFutsal.status).toBe('Pending'); // Check logic: status resets on image change
      expect(mockFutsal.save).toHaveBeenCalled();
    });
  });

  describe('PATCH /futsals/verify/:id', () => {
    test('should update status for admin approval', async () => {
      const mockFutsal = { id: 5, status: 'Pending', save: jest.fn() };
      Futsal.findByPk.mockResolvedValue(mockFutsal);

      const res = await request(app)
        .patch('/futsals/verify/5')
        .send({ status: 'Approved' });

      expect(res.statusCode).toBe(200);
      expect(mockFutsal.status).toBe('Approved');
    });
  });
});