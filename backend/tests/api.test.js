const request = require('supertest');
const app = require('../server');
const { User, Child } = require('../models');
const bcrypt = require('bcryptjs');

describe('API Endpoints', () => {
  let authToken;
  let testUser;
  let testChild;

  // Setup before all tests
  beforeAll(async () => {
    // Create a test user
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'parent',
      firstName: 'Test',
      lastName: 'User',
      phoneNumber: '1234567890'
    });

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = loginResponse.body.token;
  });

  // Cleanup after all tests
  afterAll(async () => {
    await Child.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  describe('Child Endpoints', () => {
    beforeEach(async () => {
      // Create a test child before each test
      testChild = await Child.create({
        firstName: 'Test',
        lastName: 'Child',
        dateOfBirth: '2020-01-01',
        gender: 'male',
        parentId: testUser.id,
        emergencyContactName: 'Emergency Contact',
        emergencyContactPhone: '1234567890'
      });
    });

    afterEach(async () => {
      // Clean up test child after each test
      await Child.destroy({ where: { id: testChild.id } });
    });

    // Test GET /api/children
    test('should get all children', async () => {
      const response = await request(app)
        .get('/api/children')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    // Test GET /api/children/:id
    test('should get a specific child', async () => {
      const response = await request(app)
        .get(`/api/children/${testChild.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testChild.id);
      expect(response.body.firstName).toBe('Test');
    });

    // Test POST /api/children
    test('should create a new child', async () => {
      const newChild = {
        firstName: 'New',
        lastName: 'Child',
        dateOfBirth: '2021-01-01',
        gender: 'female',
        parentId: testUser.id,
        emergencyContactName: 'New Emergency Contact',
        emergencyContactPhone: '9876543210'
      };

      const response = await request(app)
        .post('/api/children')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newChild);

      expect(response.status).toBe(201);
      expect(response.body.firstName).toBe('New');
      expect(response.body.lastName).toBe('Child');
    });

    // Test PUT /api/children/:id
    test('should update a child', async () => {
      const updatedData = {
        firstName: 'Updated',
        lastName: 'Child',
        dateOfBirth: '2020-01-01',
        gender: 'male',
        parentId: testUser.id,
        emergencyContactName: 'Updated Emergency Contact',
        emergencyContactPhone: '1234567890'
      };

      const response = await request(app)
        .put(`/api/children/${testChild.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe('Updated');
    });

    // Test DELETE /api/children/:id
    test('should delete a child', async () => {
      const response = await request(app)
        .delete(`/api/children/${testChild.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Child deleted successfully');

      // Verify the child is actually deleted
      const deletedChild = await Child.findByPk(testChild.id);
      expect(deletedChild).toBeNull();
    });
  });
}); 