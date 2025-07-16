import { PrismaClient, User } from '@prisma/client';

import { BadRequestError } from '../common/errors/bad-request';
import { NotFoundError } from '../common/errors/not-found';
import { hashPassword, comparePassword } from '../auth/auth.utils';
import { CreateUserData, UpdateUserData } from './users.schema';
import { UserResponse } from './users.types';

export class UsersService {
  constructor(private prisma: PrismaClient) {}

  private mapUserToResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  private async validateUserExists(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  private async validateEmailNotExists(
    email: string,
    excludeUserId?: string
  ): Promise<void> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== excludeUserId) {
      throw new BadRequestError('Email is already in use');
    }
  }

  async createUser(data: CreateUserData): Promise<UserResponse> {
    // Validate email uniqueness
    await this.validateEmailNotExists(data.email);

    // Hash password
    const hashedPassword = hashPassword(data.password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
      },
    });

    return this.mapUserToResponse(user);
  }

  async getUserById(userId: string): Promise<UserResponse> {
    const user = await this.validateUserExists(userId);
    return this.mapUserToResponse(user);
  }

  async updateUser(
    userId: string,
    data: UpdateUserData
  ): Promise<UserResponse> {
    // Check if user exists first
    await this.validateUserExists(userId);

    // Validate email uniqueness if email is being updated
    if (data.email) {
      await this.validateEmailNotExists(data.email, userId);
    }

    // Update user directly - Prisma handles undefined values automatically
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.email && { email: data.email }),
      },
    });

    return this.mapUserToResponse(updatedUser);
  }

  async validateCredentials(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }

    const isValidPassword = comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new BadRequestError('Invalid credentials');
    }

    return user;
  }
}
