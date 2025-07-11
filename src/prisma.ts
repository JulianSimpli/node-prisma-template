import { PrismaClient } from '@prisma/client';
import { NodeEnv } from './common/enums/node-env';
import { config } from './config';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (config.NODE_ENV !== NodeEnv.Production) globalForPrisma.prisma = prisma;
