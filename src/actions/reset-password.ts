'use server';

import { ResetType } from '@/components/auth/ResetForm';
import pool from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/mail';
import { ResetSchema } from '@/lib/schema';
import { generateResetPasswordToken } from '@/lib/token-utils';
import { getUserByEmail } from '@/procedures/usersProcedure';

export const resetPassword = async (formData: ResetType) => {
  const db = await pool.connect();
  try {
    const validations = ResetSchema.safeParse(formData);

    if (!validations.success) {
      return { error: 'Invalid fields' };
    }

    const { email } = validations.data;

    const userExists = await getUserByEmail(email);

    if (!userExists) {
      return { error: 'User not found' };
    }

    if (!userExists.emailVerified) {
      return { error: 'Email not verified' };
    }

    const verificationToken = await generateResetPasswordToken(
      db,
      userExists.email
    );
    await sendPasswordResetEmail(
      verificationToken.token,
      verificationToken.email
    );

    return { success: 'Reset email sent!' };
  } catch (error) {
    console.log(error);
    return { error: 'Internal Server Error' };
  } finally {
    db.release();
  }
};
