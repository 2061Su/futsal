const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');
const User = require('../models/User');
const authController = require('../controllers/authController');


jest.mock('../models/User');
jest.mock('../controllers/authController', () => ({
  register: jest.fn((req, res) => res.status(201).json({ message: 'Success' })),
  login: jest.fn((req, res) => res.status(200).json({ token: 'fake-token' })),
  forgotPassword: jest.fn((req, res) => res.status(200).json({ message: 'Sent' })),
  resetPassword: jest.fn((req, res) => res.status(200).json({ message: 'Reset' })),
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes Integration Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST Endpoints (Delegated to Controller)', () => {
    test('POST /register should call authController.register', async () => {
      const res = await request(app).post('/api/auth/register').send({ name: 'Test' });
      expect(res.statusCode).toBe(201);
      expect(authController.register).toHaveBeenCalled();
    });

    test('POST /login should call authController.login', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'a@a.com' });
      expect(res.statusCode).toBe(200);
      expect(authController.login).toHaveBeenCalled();
    });
  });

  describe('GET /api/auth/user/:id', () => {
    test('should return user data without password', async () => {
      const mockUser = { name: 'John Doe', email: 'john@example.com', role: 'Player' };
      User.findByPk.mockResolvedValue(mockUser);

      const res = await request(app).get('/api/auth/user/1');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockUser);
      
      expect(User.findByPk).toHaveBeenCalledWith("1", expect.objectContaining({
        attributes: ['name', 'email', 'phone', 'role']
      }));
    });

    test('should return 404 if user not found', async () => {
      User.findByPk.mockResolvedValue(null);
      const res = await request(app).get('/api/auth/user/999');
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("User not found"); 
    });
  });

  describe('PUT /api/auth/profile/:id', () => {
    test('should update profile successfully', async () => {
      const mockUser = {
        id: 1,
        phone: '123',
        name: 'Old Name',
        save: jest.fn().mockResolvedValue(true)
      };
      User.findByPk.mockResolvedValue(mockUser);

      const res = await request(app)
        .put('/api/auth/profile/1')
        .send({ phone: '9841', name: 'New Name' });

      expect(res.statusCode).toBe(200);
      expect(mockUser.phone).toBe('9841');
      expect(mockUser.name).toBe('New Name');
      expect(mockUser.save).toHaveBeenCalled();
    });

    test('should keep existing data if fields are missing in request', async () => {
      const mockUser = {
        id: 1,
        phone: '123',
        name: 'John',
        save: jest.fn().mockResolvedValue(true)
      };
      User.findByPk.mockResolvedValue(mockUser);

      
      await request(app).put('/api/auth/profile/1').send({ phone: '000' });

      expect(mockUser.phone).toBe('000');
      expect(mockUser.name).toBe('John'); 
    });
  });
});