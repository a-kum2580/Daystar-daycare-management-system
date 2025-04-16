const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Import database connection
const db = require('./config/database');

// Import seed data utility
const { seedAdminUser } = require('./utils/seedData');

// Import routes
const authRoutes = require('./routes/auth.routes');
const testRoutes = require('./routes/test.routes');
const childrenRoutes = require('./routes/children.routes');
const babysitterRoutes = require('./routes/babysitter.routes');
const adminRoutes = require('./routes/admin.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const notificationRoutes = require('./routes/notification.routes');
// Other routes to be implemented
// const attendanceRoutes = require('./routes/attendance.routes');
// const incidentRoutes = require('./routes/incident.routes');
// const financialRoutes = require('./routes/financial.routes');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/children', childrenRoutes);
app.use('/api/babysitters', babysitterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
// These routes will be implemented later
// app.use('/api/attendance', attendanceRoutes);
// app.use('/api/incidents', incidentRoutes);
// app.use('/api/financial', financialRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Daystar Daycare Center API' });
});

// API health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Database connection
db.authenticate()
  .then(() => {
    console.log('Database connection established successfully');
    // Force sync to recreate all tables
    return db.sync({ force: true });
  })
  .then(() => {
    console.log('Database synchronized');
    
    // Seed admin user data
    return seedAdminUser();
  })
  .then(() => {
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = app; 