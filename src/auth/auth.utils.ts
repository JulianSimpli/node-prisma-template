import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';
import jwt from 'jsonwebtoken';

import { config } from '../config';
import { JWTPayload } from './auth.types';

const PASSWORD_CONFIG = {
  ITERATIONS: 10000,
  KEY_LENGTH: 64,
  DIGEST: 'sha512',
  SALT_LENGTH: 32,
};

export function hashPassword(password: string): string {
  const salt = randomBytes(PASSWORD_CONFIG.SALT_LENGTH).toString('hex');
  const hash = pbkdf2Sync(
    password,
    salt,
    PASSWORD_CONFIG.ITERATIONS,
    PASSWORD_CONFIG.KEY_LENGTH,
    PASSWORD_CONFIG.DIGEST
  ).toString('hex');
  return `${salt}:${hash}`;
}

export function comparePassword(
  password: string,
  hashedPassword: string
): boolean {
  const [salt, hash] = hashedPassword.split(':');
  const testHash = pbkdf2Sync(
    password,
    salt,
    PASSWORD_CONFIG.ITERATIONS,
    PASSWORD_CONFIG.KEY_LENGTH,
    PASSWORD_CONFIG.DIGEST
  ).toString('hex');
  return timingSafeEqual(
    Buffer.from(hash, 'hex'),
    Buffer.from(testHash, 'hex')
  );
}

export function generateAccessToken(userId: string): string {
  return jwt.sign({ id: userId }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign({ id: userId }, config.JWT_SECRET, {
    expiresIn: config.REFRESH_EXPIRES_IN,
  });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, config.JWT_SECRET) as JWTPayload;
}
