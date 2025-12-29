const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const futsalRoutes = require('./routes/futsalRoutes');
const bookingRoutes = require('./routes/bookingRoutes');


const User = require('./models/User'); 
const Futsal = require('./models/Futsal');
const Booking = require('./models/Booking');


User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Futsal.hasMany(Booking, { foreignKey: 'futsalId' });
Booking.belongsTo(Futsal, { foreignKey: 'futsalId' });

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/futsals', futsalRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;


sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('🐘 PostgreSQL Connected & Bookings Table Ready');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Unable to connect to PostgreSQL:', err));