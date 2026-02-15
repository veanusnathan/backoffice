import { z } from 'zod';

export const createUserSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  roleIds: z.array(z.number()).default([]),
});

export const updateUserSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().optional(),
  roleIds: z.array(z.number()).default([]),
}).refine(
  (data) => !data.password || data.password.length >= 6,
  { message: 'Password must be at least 6 characters', path: ['password'] }
);

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
