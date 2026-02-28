const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Booking = sequelize.define('Booking', {
  date: {
    type: DataTypes.DATEONLY, 
    allowNull: false
  },
  timeSlot: {
    type: DataTypes.STRING, 
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Confirmed', 'Rejected'), 
    defaultValue: 'Pending'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  futsalId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Booking;