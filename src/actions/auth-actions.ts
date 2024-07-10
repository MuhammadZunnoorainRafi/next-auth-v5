'use server';

import { LogType } from '@/components/auth/LoginForm';
import { LogSchema } from '@/lib/schema';

export const login = async (formData: LogType) => {
  const validations = LogSchema.safeParse(formData);
  if (!validations.success) {
    return { error: 'Invalid Fields' };
  }
  return { success: 'Email Sent' };
};
