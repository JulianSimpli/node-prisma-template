import { z } from 'zod';

// Validation schemas
export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const updateUserSchema = z.object({
  email: z.string().email('Email inválido').optional(),
});

// Types
export type CreateUserData = z.infer<typeof createUserSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;
