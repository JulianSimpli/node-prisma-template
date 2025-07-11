import { z } from 'zod';

import { NodeEnv } from './common/enums/node-env';

const envSchema = z.object({
  PORT: z.string().regex(/^\d+$/).transform(Number),
  NODE_ENV: z.nativeEnum(NodeEnv),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z
    .number()
    .optional()
    .default(15 * 60),
  REFRESH_EXPIRES_IN: z
    .number()
    .optional()
    .default(7 * 24 * 60 * 60),
  ALLOWED_ORIGINS: z.string().optional().default('http://localhost:3000'),
  DATABASE_URL: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const errorDetails = parsed.error.errors
    .map(err => {
      const received =
        typeof err === 'object' && err && 'received' in err
          ? (err as { received?: unknown }).received
          : undefined;
      return `  - ${err.path.join('.')}: ${err.message} (received: ${JSON.stringify(received)})`;
    })
    .join('\n');

  const red = (str: string) => `\x1b[31m${str}\x1b[0m`;

  console.error(
    red('❌ Invalid environment variables:\n') +
      errorDetails +
      '\n\nPlease check your .env file or environment settings.'
  );
  process.exit(1);
}

export const config: {
  PORT: number;
  NODE_ENV: NodeEnv;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: number;
  REFRESH_EXPIRES_IN: number;
  ALLOWED_ORIGINS: string;
  DATABASE_URL: string;
} = parsed.data;
