'use server';

import { LogType } from '@/components/auth/LoginForm';
import { RegType } from '@/components/auth/RegisterForm';
import { LogSchema, RegSchema } from '@/lib/schema';

export const login = async (formData: LogType) => {
  const validations = LogSchema.safeParse(formData);
  if (!validations.success) {
    return { error: 'Invalid Fields' };
  }
  return { success: 'Email Sent' };
};

export const register = async (formData: RegType) => {
  const validations = RegSchema.safeParse(formData);

  if (!validations.success) {
    return { error: 'Invalid Fields' };
  }

  return { success: 'Email Sent' };
};
