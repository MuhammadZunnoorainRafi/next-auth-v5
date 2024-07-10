import { z } from 'zod';

export const LogSchema = z.object({
  email: z
    .string()
    .min(1, 'Enter email')
    .email({ message: 'Enter a valid email address' }),
  password: z.string().min(6, 'Password must be above 5 characters'),
});
