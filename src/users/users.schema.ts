import { z } from 'zod';

// Validation schemas
export const createUserSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email').optional(),
});

// Types
export type CreateUserData = z.infer<typeof createUserSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;
