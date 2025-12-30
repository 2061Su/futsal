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
    type: DataTypes.ENUM('Pending', 'Confirmed', 'Rejected'), // Using ENUM for stricter data
    defaultValue: 'Pending'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Foreign Keys (Sequelize usually creates these via associations, 
  // but defining them here makes queries more predictable)
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