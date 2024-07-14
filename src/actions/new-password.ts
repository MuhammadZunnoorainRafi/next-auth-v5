'use server';

import { NewPasswordType } from '@/components/auth/NewPasswordForm';
import pool from '@/lib/db';
import { NewPasswordSchema } from '@/lib/schema';
import { getResetPasswordTokenByToken } from '@/procedures/tokensProcedure';
import { getUserByEmail } from '@/procedures/usersProcedure';
import bcrypt from 'bcryptjs';

export const newPassword = async (formData: NewPasswordType, token: string) => {
  const db = await pool.connect();
  try {
    if (!token) {
      return { error: 'Token is missing' };
    }

    const validation = NewPasswordSchema.safeParse(formData);

    if (!validation.success) {
      return { error: 'Invalid fields' };
    }

    const existingToken = await getResetPasswordTokenByToken(db, token);

    if (!existingToken) {
      return { error: 'Token not exists' };
    }

    const isTokenExpired = new Date(existingToken.expires) < new Date();

    if (isTokenExpired) {
      return { error: 'Token expired!' };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      return { error: 'User not found' };
    }

    const { password } = validation.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(`UPDATE users SET password = $1 WHERE id = $2`, [
      hashedPassword,
      existingUser.id,
    ]);

    await db.query(`DELETE from password_reset_token WHERE id = $1`, [
      existingToken.id,
    ]);

    return { success: 'Password Updated' };
  } catch (error) {
    console.log(error);
    return { error: 'Internal server error' };
  } finally {
    db.release();
  }
};
