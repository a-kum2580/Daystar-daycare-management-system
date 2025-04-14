// Load environment variables for testing
require('dotenv').config({ path: '.env.test' });

// Set test database configuration
process.env.DB_NAME = 'daystar_test';
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = '';
process.env.DB_HOST = 'localhost';
process.env.JWT_SECRET = 'test-secret-key'; 