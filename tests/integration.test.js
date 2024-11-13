import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../src/app.js';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let testSequelize;

describe('API Integration Tests', () => {
  beforeAll(async () => {
    testSequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false, // Disable logging during tests
      }
    );
    await testSequelize.sync({ force: true }); // This ensures a clean slate for each test run
  });

  afterAll(async () => {
    await testSequelize.close();
  });

  describe('Health Check', () => {
    it('GET /healthz should return 200 OK when database is healthy', async () => {
      const response = await request(app).get('/healthz');
      expect(response.status).toBe(200);
    });

    it('GET /healthz should return 503 Service Unavailable when database is unhealthy', async () => {
      // Simulate database failure
      const mockAuthenticate = jest.spyOn(Sequelize.prototype, 'authenticate').mockRejectedValueOnce(new Error('DB Error'));
      
      const response = await request(app).get('/healthz');
      expect(response.status).toBe(503);

      mockAuthenticate.mockRestore();
    });

    it('POST /healthz should return 405 Method Not Allowed', async () => {
      const response = await request(app).post('/healthz');
      expect(response.status).toBe(405);
    });
  });

  describe('User Management', () => {
    const testUser = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      password: 'Password123!'
    };

    it('POST /v1/user should create a new user', async () => {
      const response = await request(app)
        .post('/v1/user')
        .send(testUser);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('account_created');
      expect(response.body).toHaveProperty('account_updated');
      expect(response.body.email).toBe(testUser.email);
    });

    it('POST /v1/user should return 400 for invalid input', async () => {
      const invalidUser = { ...testUser, email: 'invalid-email' };
      const response = await request(app)
        .post('/v1/user')
        .send(invalidUser);
      expect(response.status).toBe(400);
    });

    it('GET /v1/user/self should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .get('/v1/user/self')
        .auth('wrong@email.com', 'wrongpassword');
      expect(response.status).toBe(401);
    });

    it('PUT /v1/user/self should return 400 for invalid input', async () => {
      const invalidUpdate = {
        email: 'invalid-email'
      };
      const response = await request(app)
        .put('/v1/user/self')
        .auth(testUser.email, testUser.password)
        .send(invalidUpdate);
      expect(response.status).toBe(400);
    });
  });

  describe('404 Not Found', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route');
      expect(response.status).toBe(404);
    });
  });
});