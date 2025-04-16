const { User } = require('../models');
const { ROLES } = require('../config/constants');

const seedAdminUser = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({
      where: { role: ROLES.ADMIN }
    });

    if (adminExists) {
      console.log('Admin user already exists, skipping admin seed');
      return;
    }

    // Create admin user
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@daystar.com',
      password: 'admin123', // Will be hashed by model hooks
      role: ROLES.ADMIN,
      phone: '+256700000000'
    });

    console.log('Admin user created successfully:', admin.email);
    
    // Create a default babysitter for testing
    const babysitter = await User.create({
      firstName: 'Test',
      lastName: 'Babysitter',
      email: 'babysitter@daystar.com',
      password: 'babysitter123', // Will be hashed by model hooks
      role: ROLES.BABYSITTER,
      phone: '+256700000001'
    });
    
    console.log('Test babysitter created successfully:', babysitter.email);
    
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

module.exports = {
  seedAdminUser
}; 