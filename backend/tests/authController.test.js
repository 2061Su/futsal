const { register, login } = require('../controllers/authController');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


jest.mock('../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller - Register', () => {
  let req, res;

  beforeEach(() => {
    
    req = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'Player'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test('should register a new user successfully', async () => {
   
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue(req.body);

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "User created successfully" });
  });

  test('should return 400 if user already exists', async () => {
    
    User.findOne.mockResolvedValue({ email: 'test@example.com' });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
  });
});

describe('Auth Controller - Login', () => {
  let req, res;

  beforeEach(() => {
    req = { body: { email: 'test@example.com', password: 'password123' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test('should login successfully with correct credentials', async () => {
    const mockUser = { id: 1, name: 'Test', email: 'test@example.com', password: 'hashedPassword', role: 'Player' };
    
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('fake-token');

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'fake-token' }));
  });
});