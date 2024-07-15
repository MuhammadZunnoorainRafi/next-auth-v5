'use server';
import { signIn } from '@/auth';
import { LogType } from '@/components/auth/LoginForm';
import pool from '@/lib/db';
import { sendTwoFactorCodeEmail, sendVerificationEmail } from '@/lib/mail';
import { LogSchema } from '@/lib/schema';
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from '@/lib/generate-tokens';
import { getUserByEmail } from '@/procedures/usersProcedure';
import { AuthError } from 'next-auth';
import {
  getTwoFactorConfirmationByUserId,
  getTwoFactorTokenByEmail,
} from '@/procedures/2FAProceduret';

export const login = async (formData: LogType) => {
  const db = await pool.connect();
  try {
    const validations = LogSchema.safeParse(formData);
    if (!validations.success) {
      return { error: 'Invalid Fields' };
    }
    const { email, password, code } = validations.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return { error: 'Email not exists' };
    }

    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(
        db,
        existingUser.email
      );
      await sendVerificationEmail(
        verificationToken.token,
        verificationToken.email
      );

      return { success: 'Confirmation email sent' };
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
      if (code) {
        const twoFactorToken = await getTwoFactorTokenByEmail(
          db,
          existingUser.email
        );
        if (!twoFactorToken) {
          return { error: 'Token not found' };
        }

        if (twoFactorToken.token !== code) {
          return { error: 'Invalid code' };
        }

        const hasExpired = new Date(twoFactorToken.expires) < new Date();

        if (hasExpired) {
          return { error: 'Code expired!' };
        }

        await db.query(`DELETE FROM two_factor_token WHERE id = $1`, [
          twoFactorToken.id,
        ]);

        const existingTwoFactorConfirmationUser =
          await getTwoFactorConfirmationByUserId(existingUser.id);

        if (existingTwoFactorConfirmationUser) {
          await db.query(
            `DELETE FROM two_factor_confirmation WHERE user_id = $1`,
            [existingUser.id]
          );
        }

        await db.query(
          `INSERT INTO two_factor_confirmation(user_id) VALUES ($1)`,
          [existingUser.id]
        );
      } else {
        const twoFactorToken = await generateTwoFactorToken(
          db,
          existingUser.email
        );
        if (!twoFactorToken) {
          return { error: 'Token not generated' };
        }
        await sendTwoFactorCodeEmail(
          twoFactorToken.email,
          twoFactorToken.token
        );
        return { twoFactor: true };
      }
    }

    await signIn('credentials', {
      email,
      password,
      redirectTo: '/settings',
    });

    return { success: 'User signed In' };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Email or Password Incorrect' };
        case 'OAuthSignInError':
          return { error: error.message };
        case 'CallbackRouteError':
          return { error: 'Email or Password Incorrect' };
        default:
          return { error: 'Something went wrong' };
      }
    }
    throw error;
  } finally {
    db.release();
  }
};
