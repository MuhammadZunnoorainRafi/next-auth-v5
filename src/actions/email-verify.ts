'use server';
import pool from '@/lib/db';
import { getVerificationTokenByToken } from '@/procedures/tokensProcedure';
import { getUserByEmail } from '@/procedures/usersProcedure';

export const newEmailVerification = async (token: string) => {
  const db = await pool.connect();
  try {
    if (!token) {
      return { error: 'Token is missing' };
    }

    const tokenExists = await getVerificationTokenByToken(db, token);

    if (!tokenExists) {
      return { error: 'Token not exists' };
    }

    const isTokenExpired = new Date(tokenExists.expires) < new Date();

    if (isTokenExpired) {
      return { error: 'Token expired!' };
    }

    const user = await getUserByEmail(tokenExists.email);

    if (!user) {
      return { error: 'Email not exists' };
    }

    await db.query(
      `UPDATE users SET "emailVerified" = $1, email= $2 WHERE id = $3`,
      [new Date(), tokenExists.email, user.id] // tokenExists.email is when user wants to update his email
    );

    await db.query(`DELETE FROM verification_token WHERE id = $1`, [
      tokenExists.id,
    ]);

    return { success: 'Email Verified Successfully' };
  } catch (error) {
    console.log(error);
    return { error: 'Internal Server Error' };
  } finally {
    db.release();
  }
};
