const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const crypto = require('crypto');


exports.register = async (req, res) => {
  try {
      const { name, email, password, role } = req.body; // Receive role from frontend
      
      const userExists = await User.findOne({ where: { email } });
      if (userExists) return res.status(400).json({ message: 'User already exists' });

    // REMOVE THE MANUAL HASHING HERE
    // Just pass the plain password; the User Model Hook will hash it automatically
    await User.create({ 
      name, 
      email, 
      password, // Model hook handles hashing
      role: role || 'Player' // Use selected role or fallback to Player
    });
    
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.forgotPassword = async (req, res) => {

  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    const token = crypto.randomBytes(20).toString('hex');

   
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const resetUrl = `http://localhost:3000/reset-password/${token}`;

    const mailOptions = {
      from: `"Futsal App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px;">
          <h2 style="color: #10b981; text-align: center;">Password Reset</h2>
          <p>You requested to reset your password. Please click the button below to proceed:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #10b981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset My Password</a>
          </div>
          <p style="font-size: 12px; color: #666;">This link will expire in 1 hour. If you did not request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;">
          <p style="font-size: 11px; color: #999; text-align: center;">Futsal Connect Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reset link sent to your email!' });

  } catch (error) {
    res.status(500).json({ message: 'Failed to send email. Please try again later.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Reset link is invalid or has expired.' });
    }

   
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred during reset.' });
  }
};