require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { testConnection } = require('./config/database');
const { errorHandler, logger } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const babysitterRoutes = require('./routes/babysitterRoutes');
const childRoutes = require('./routes/childRoutes');
const financialRoutes = require('./routes/financialRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Initialize express
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Performance middleware
app.use(compression());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/babysitters', babysitterRoutes);
app.use('/api/children', childRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use(errorHandler);

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 3001;

// Function to start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Start server
    app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app; 