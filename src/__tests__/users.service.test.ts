import {
  UsersService,
  CreateUserData,
  UpdateUserData,
  createUserSchema,
  updateUserSchema,
} from '../users';
import { BadRequestError } from '../common/errors/bad-request';
import { NotFoundError } from '../common/errors/not-found';
import { prisma } from './setup';

describe('UsersService Integration Tests', () => {
  let usersService: UsersService;

  beforeEach(() => {
    usersService = new UsersService(prisma);
  });

  describe('createUser', () => {
    const createUserData: CreateUserData = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should create a user successfully in the database', async () => {
      const result = await usersService.createUser(createUserData);

      // Verify the result structure
      expect(result).toHaveProperty('id');
      expect(result.email).toBe(createUserData.email);
      expect(result).toHaveProperty('createdAt');
      expect(result).not.toHaveProperty('password'); // Password should not be returned

      // Verify the user was actually created in the database
      const userInDb = await prisma.user.findUnique({
        where: { id: result.id },
      });

      expect(userInDb).toBeTruthy();
      expect(userInDb!.email).toBe(createUserData.email);
      expect(userInDb!.password).not.toBe(createUserData.password); // Should be hashed
      expect(userInDb!.password).toContain(':'); // Should be PBKDF2 hash (salt:hash format)
    });

    it('should throw BadRequestError when email already exists', async () => {
      // First, create a user
      await usersService.createUser(createUserData);

      // Try to create another user with the same email
      await expect(usersService.createUser(createUserData)).rejects.toThrow(
        BadRequestError
      );
      await expect(usersService.createUser(createUserData)).rejects.toThrow(
        'El email ya está en uso'
      );

      // Verify only one user exists in the database
      const users = await prisma.user.findMany();
      expect(users).toHaveLength(1);
    });

    it('should create multiple users with different emails', async () => {
      const user1Data: CreateUserData = {
        email: 'user1@example.com',
        password: 'password123',
      };

      const user2Data: CreateUserData = {
        email: 'user2@example.com',
        password: 'password456',
      };

      const result1 = await usersService.createUser(user1Data);
      const result2 = await usersService.createUser(user2Data);

      expect(result1.email).toBe(user1Data.email);
      expect(result2.email).toBe(user2Data.email);
      expect(result1.id).not.toBe(result2.id);

      // Verify both users exist in the database
      const users = await prisma.user.findMany();
      expect(users).toHaveLength(2);
      expect(users.map(u => u.email)).toContain(user1Data.email);
      expect(users.map(u => u.email)).toContain(user2Data.email);
    });
  });

  describe('getUserById', () => {
    it('should return user when user exists in database', async () => {
      // Create a user first
      const createUserData: CreateUserData = {
        email: 'test@example.com',
        password: 'password123',
      };
      const createdUser = await usersService.createUser(createUserData);

      // Get the user by ID
      const result = await usersService.getUserById(createdUser.id);

      expect(result).toEqual({
        id: createdUser.id,
        email: createdUser.email,
        createdAt: createdUser.createdAt,
      });
    });

    it('should throw NotFoundError when user does not exist', async () => {
      const nonExistentId = 'non-existent-id';

      await expect(usersService.getUserById(nonExistentId)).rejects.toThrow(
        NotFoundError
      );
      await expect(usersService.getUserById(nonExistentId)).rejects.toThrow(
        'Usuario no encontrado'
      );
    });
  });

  describe('updateUser', () => {
    let createdUser: { id: string; email: string; createdAt: Date };

    beforeEach(async () => {
      // Create a user for each test
      const createUserData: CreateUserData = {
        email: 'original@example.com',
        password: 'password123',
      };
      createdUser = await usersService.createUser(createUserData);
    });

    it('should update user email successfully', async () => {
      const updateUserData: UpdateUserData = {
        email: 'updated@example.com',
      };

      const result = await usersService.updateUser(
        createdUser.id,
        updateUserData
      );

      expect(result).toEqual({
        id: createdUser.id,
        email: updateUserData.email,
        createdAt: createdUser.createdAt,
      });

      // Verify the update was persisted in the database
      const userInDb = await prisma.user.findUnique({
        where: { id: createdUser.id },
      });

      expect(userInDb!.email).toBe(updateUserData.email);
    });

    it('should update user with empty data without errors', async () => {
      const result = await usersService.updateUser(createdUser.id, {});

      expect(result).toEqual({
        id: createdUser.id,
        email: createdUser.email,
        createdAt: createdUser.createdAt,
      });

      // Verify the user still exists with original data
      const userInDb = await prisma.user.findUnique({
        where: { id: createdUser.id },
      });

      expect(userInDb!.email).toBe(createdUser.email);
    });

    it('should throw NotFoundError when user does not exist', async () => {
      const nonExistentId = 'non-existent-id';
      const updateUserData: UpdateUserData = {
        email: 'updated@example.com',
      };

      await expect(
        usersService.updateUser(nonExistentId, updateUserData)
      ).rejects.toThrow(NotFoundError);
      await expect(
        usersService.updateUser(nonExistentId, updateUserData)
      ).rejects.toThrow('Usuario no encontrado');
    });

    it('should throw BadRequestError when new email already exists', async () => {
      // Create another user with a different email
      const anotherUserData: CreateUserData = {
        email: 'another@example.com',
        password: 'password456',
      };
      await usersService.createUser(anotherUserData);

      // Try to update the first user with the second user's email
      const updateUserData: UpdateUserData = {
        email: 'another@example.com',
      };

      await expect(
        usersService.updateUser(createdUser.id, updateUserData)
      ).rejects.toThrow(BadRequestError);
      await expect(
        usersService.updateUser(createdUser.id, updateUserData)
      ).rejects.toThrow('El email ya está en uso');

      // Verify the original user's email wasn't changed
      const userInDb = await prisma.user.findUnique({
        where: { id: createdUser.id },
      });
      expect(userInDb!.email).toBe(createdUser.email);
    });

    it('should allow updating to the same email', async () => {
      const updateUserData: UpdateUserData = {
        email: createdUser.email, // Same email
      };

      const result = await usersService.updateUser(
        createdUser.id,
        updateUserData
      );

      expect(result).toEqual({
        id: createdUser.id,
        email: createdUser.email,
        createdAt: createdUser.createdAt,
      });

      // Verify the user still exists with the same email
      const userInDb = await prisma.user.findUnique({
        where: { id: createdUser.id },
      });
      expect(userInDb!.email).toBe(createdUser.email);
    });
  });

  describe('Validation schemas', () => {
    describe('createUserSchema', () => {
      it('should validate valid user data', () => {
        const validData = {
          email: 'test@example.com',
          password: 'password123',
        };

        const result = createUserSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject invalid email', () => {
        const invalidData = {
          email: 'invalid-email',
          password: 'password123',
        };

        const result = createUserSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Email inválido');
        }
      });

      it('should reject short password', () => {
        const invalidData = {
          email: 'test@example.com',
          password: '123',
        };

        const result = createUserSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            'La contraseña debe tener al menos 6 caracteres'
          );
        }
      });
    });

    describe('updateUserSchema', () => {
      it('should validate valid update data', () => {
        const validData = {
          email: 'updated@example.com',
        };

        const result = updateUserSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should validate empty object', () => {
        const validData = {};

        const result = updateUserSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject invalid email', () => {
        const invalidData = {
          email: 'invalid-email',
        };

        const result = updateUserSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Email inválido');
        }
      });
    });
  });
});
