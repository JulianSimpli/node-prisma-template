import request from 'supertest';
import { app } from '../app';
import { prisma } from './setup';

describe('Rate Limiting Tests', () => {
  beforeEach(async () => {
    // Clean up database before each test
    await prisma.user.deleteMany();
  });

  describe('Authentication Rate Limiting', () => {
    it('should limit login attempts to 5 per 15 minutes', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Try to login 6 times (should fail on the 6th attempt)
      for (let i = 0; i < 5; i++) {
        const response = await request(app)
          .post('/api/auth/login')
          .send(loginData);

        // First 5 attempts should fail due to invalid credentials, but not rate limiting
        expect(response.status).toBe(400);
        expect(response.body.errors[0].message).toBe('Invalid credentials');
      }

      // 6th attempt should be rate limited
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(429);
      expect(response.body.errors[0].message).toBe(
        'Too many authentication attempts, please try again later'
      );
    });

    it('should limit registration attempts to 3 per hour', async () => {
      const registrationData = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Try to register 4 times (should fail on the 4th attempt)
      for (let i = 0; i < 3; i++) {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            ...registrationData,
            email: `test${i}@example.com`,
          });

        // First 3 attempts should succeed
        expect(response.status).toBe(201);
      }

      // 4th attempt should be rate limited
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...registrationData,
          email: 'test4@example.com',
        });

      expect(response.status).toBe(429);
      expect(response.body.errors[0].message).toBe(
        'Too many registration attempts, please try again later'
      );
    });

    it('should limit refresh token attempts to 10 per 15 minutes', async () => {
      const refreshData = {
        refreshToken: 'invalid-token',
      };

      // Try to refresh 11 times (should fail on the 11th attempt)
      for (let i = 0; i < 10; i++) {
        const response = await request(app)
          .post('/api/auth/refresh')
          .send(refreshData);

        // First 10 attempts should fail due to invalid token, but not rate limiting
        expect(response.status).toBe(400);
        expect(response.body.errors[0].message).toBe('Invalid refresh token');
      }

      // 11th attempt should be rate limited
      const response = await request(app)
        .post('/api/auth/refresh')
        .send(refreshData);

      expect(response.status).toBe(429);
      expect(response.body.errors[0].message).toBe(
        'Too many token refresh attempts, please try again later'
      );
    });
  });

  describe('General API Rate Limiting', () => {
    it('should limit general API requests to 100 per 15 minutes', async () => {
      let first429Index = -1;
      const responses: number[] = [];
      // Hacemos 120 peticiones para asegurarnos de cruzar el límite
      for (let i = 0; i < 120; i++) {
        const response = await request(app).get('/api/non-existent');
        responses.push(response.status);
        if (response.status === 429 && first429Index === -1) {
          first429Index = i;
        }
      }
      // Todas las respuestas antes del primer 429 deben ser 404
      for (let i = 0; i < first429Index; i++) {
        expect(responses[i]).toBe(404);
      }
      // Todas las respuestas a partir del primer 429 deben ser 429
      for (let i = first429Index; i < responses.length; i++) {
        expect(responses[i]).toBe(429);
      }
      // El primer 429 debe ocurrir en la petición 100 o antes
      expect(first429Index).toBeGreaterThanOrEqual(0);
      expect(first429Index).toBeLessThanOrEqual(100);
    });
  });

  describe('Rate Limit Headers', () => {
    it('should include rate limit headers in responses', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.headers).toHaveProperty('ratelimit-limit');
      expect(response.headers).toHaveProperty('ratelimit-remaining');
      expect(response.headers).toHaveProperty('ratelimit-reset');
    });
  });
});
