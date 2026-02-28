const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const Futsal = sequelize.define('Futsal', {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  location: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  openingTime: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  closingTime: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  contact: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  pricePerHour: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
    defaultValue: 'Pending' 
  },
  imageUrl: {
  type: DataTypes.STRING,
  allowNull: true, 
  defaultValue: 'https://via.placeholder.com/400x250?text=No+Image+Available'
},

  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Futsal;