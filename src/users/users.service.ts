import { PrismaClient, User } from '@prisma/client';

import { BadRequestError } from '../common/errors/bad-request';
import { NotFoundError } from '../common/errors/not-found';
import { hashPassword } from '../auth/auth.utils';
import { CreateUserData, UpdateUserData } from './users.schema';
import { UserResponse } from './users.types';

export class UsersService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

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
      throw new NotFoundError('Usuario no encontrado');
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
      throw new BadRequestError('El email ya está en uso');
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
    // Validate user exists
    await this.validateUserExists(userId);

    // Validate email uniqueness if email is being updated
    if (data.email) {
      await this.validateEmailNotExists(data.email, userId);
    }

    // Prepare update data
    const updateData: { email?: string } = {};
    if (data.email) updateData.email = data.email;

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return this.mapUserToResponse(updatedUser);
  }
}
