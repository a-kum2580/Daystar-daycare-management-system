const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Environment variables configuration
module.exports = {
  // Server configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database configuration
  DB_URI: process.env.DB_URI || 'mongodb://localhost:27017/daystar',
  
  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET || 'daystar_jwt_secret_key_2024',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  
  // CORS configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001',
  
  // Email Configuration
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM,
  
  // File Upload Configuration
  UPLOAD_PATH: process.env.UPLOAD_PATH || 'uploads',
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || '5mb'
}; 