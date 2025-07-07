import { PrismaClient } from "@prisma/client";

import { BadRequestError } from "../common/errors/bad-request";
import {
  UserRegistrationData,
  UserLoginData,
  RefreshTokenData,
  AuthTokens,
  AuthResponse,
} from "./auth.types";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "./auth.utils";

const prisma = new PrismaClient();

// Token generation functions
function generateAuthTokens(userId: string): AuthTokens {
  return {
    accessToken: generateAccessToken(userId),
    refreshToken: generateRefreshToken(userId),
  };
}

// User validation functions
async function validateUserExists(email: string): Promise<void> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new BadRequestError("Email already in use");
  }
}

async function validateUserCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new BadRequestError("Invalid credentials");
  }
  
  const isValidPassword = comparePassword(password, user.password);
  if (!isValidPassword) {
    throw new BadRequestError("Invalid credentials");
  }
  
  return user;
}

// Main service functions
export async function register(data: UserRegistrationData): Promise<AuthResponse> {
  await validateUserExists(data.email);
  
  const hashedPassword = hashPassword(data.password);
  const user = await prisma.user.create({ 
    data: { 
      email: data.email, 
      password: hashedPassword 
    } 
  });
  
  const tokens = generateAuthTokens(user.id);
  
  return {
    ...tokens,
    user: {
      id: user.id,
      email: user.email,
    },
  };
}

export async function login(data: UserLoginData): Promise<AuthResponse> {
  const user = await validateUserCredentials(data.email, data.password);
  const tokens = generateAuthTokens(user.id);
  
  return {
    ...tokens,
    user: {
      id: user.id,
      email: user.email,
    },
  };
}

export async function refresh(data: RefreshTokenData): Promise<AuthTokens> {
  try {
    const payload = verifyToken(data.refreshToken);
    const accessToken = generateAccessToken(payload.id);
    const refreshToken = generateRefreshToken(payload.id);
    
    return { accessToken, refreshToken };
  } catch (error) {
    throw new BadRequestError("Invalid refresh token");
  }
} 