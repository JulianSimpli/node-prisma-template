import { PrismaClient } from '@prisma/client';

// Use a real PrismaClient for integration tests
const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.DATABASE_URL ||
        'postgres://postgres:postgres@localhost:5432/appdb',
    },
  },
});

// Global setup - runs once before all tests
beforeAll(async () => {
  // Ensure database is clean before starting tests
  await prisma.user.deleteMany();
});

// Global teardown - runs once after all tests
afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

// Clean up data after each test
afterEach(async () => {
  await prisma.user.deleteMany();
});

// Export prisma instance for use in tests
export { prisma };
