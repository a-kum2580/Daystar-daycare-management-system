const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();

const sequelize = require('./config/database');

const authRoutes = require('./routes/auth.routes');
const childrenRoutes = require('./routes/children.routes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/user.routes');
const babysitterRoutes = require('./routes/babysitter.routes');
const notificationRoutes = require('./routes/notification.routes');

const app = express();

// Test database connection and sync models
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    return sequelize.sync({ alter: true }); // This will create tables if they don't exist
  })
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/children', childrenRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/babysitters', babysitterRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

module.exports = app; 