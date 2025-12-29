const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const Futsal = sequelize.define('Futsal', {
  name: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  openingTime: { type: DataTypes.STRING, allowNull: false },
  closingTime: { type: DataTypes.STRING, allowNull: false },
  contact: { type: DataTypes.STRING, allowNull: false },
  pricePerHour: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Futsal;