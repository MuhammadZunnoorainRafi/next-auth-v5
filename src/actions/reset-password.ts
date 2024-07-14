'use server';

import { ResetType } from '@/components/auth/ResetForm';
import { ResetSchema } from '@/lib/schema';
import { getUserByEmail } from '@/procedures/usersProcedure';
import { z } from 'zod';

export const resetPassword = async (formData: ResetType) => {
  const validations = ResetSchema.safeParse(formData);

  if (!validations.success) {
    return { error: 'Invalid fields' };
  }

  const { email } = validations.data;

  const userExists = await getUserByEmail(email);

  if (!userExists) {
    return { error: 'User not found' };
  }

  return { success: 'Reset email sent!' };
};
