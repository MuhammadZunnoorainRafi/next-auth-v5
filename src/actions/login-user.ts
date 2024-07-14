'use server';
import { LogType } from '@/components/auth/LoginForm';
import pool from '@/lib/db';
import { sendVerificationEmail } from '@/lib/mail';
import { LogSchema } from '@/lib/schema';
import { generateVerificationToken } from '@/lib/token-utils';
import { getUserByEmail } from '@/procedures/usersProcedure';
import { AuthError } from 'next-auth';
import { signIn } from 'next-auth/react';

export const login = async (formData: LogType) => {
  const validations = LogSchema.safeParse(formData);
  if (!validations.success) {
    return { error: 'Invalid Fields' };
  }
  const { email, password } = validations.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Email not exists' };
  }

  if (!existingUser.emailVerified) {
    const db = await pool.connect();
    const verificationToken = await generateVerificationToken(db, email);
    db.release();
    await sendVerificationEmail(
      verificationToken.token,
      verificationToken.email
    );

    return { success: 'Confirmation email sent' };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/settings',
    });
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
  }
};
