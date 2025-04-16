-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS daystar_daycare;

-- Create user if it doesn't exist
CREATE USER IF NOT EXISTS 'daystar_user'@'localhost' IDENTIFIED BY 'daystar123';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON daystar_daycare.* TO 'daystar_user'@'localhost';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;

-- Switch to the database
USE daystar_daycare;

-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('admin', 'babysitter') NOT NULL DEFAULT 'babysitter',
  isActive BOOLEAN DEFAULT true,
  lastLogin DATETIME,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
); 