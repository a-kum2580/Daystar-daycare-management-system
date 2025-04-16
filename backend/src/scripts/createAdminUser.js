const { User } = require('../models');
const { ROLES } = require('../config/constants');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');

async function createAdminUser() {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({
      where: { email: 'admin@daystar.com' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists.');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@daystar.com',
      password: hashedPassword,
      phone: '1234567890',
      role: ROLES.ADMIN,
      isActive: true
    });

    console.log('Admin user created successfully:', {
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role
    });

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser(); 