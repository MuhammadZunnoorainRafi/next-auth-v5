'use server';

import { signIn } from '@/auth';
import { LogType } from '@/components/auth/LoginForm';
import { RegType } from '@/components/auth/RegisterForm';
import pool from '@/lib/db';
import { sendVerificationEmail } from '@/lib/mail';
import { LogSchema, RegSchema } from '@/lib/schema';
import { generateVerificationToken } from '@/lib/utils';
import { getVerificationTokenByToken } from '@/procedures/tokensProcedure';
import { getUserByEmail } from '@/procedures/usersProcedure';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';

// LOGIN ACTION
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

// REGISTER ACTION
export const register = async (formData: RegType) => {
  const validations = RegSchema.safeParse(formData);

  if (!validations.success) {
    return { error: 'Invalid Fields' };
  }

  const { name, email, password } = validations.data;

  const db = await pool.connect();
  try {
    const userExists = await getUserByEmail(email);
    if (userExists) {
      return { error: 'User already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows: userCreated } = await db.query(
      `INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING id`,
      [name, email, hashedPassword]
    );

    if (!userCreated[0]) {
      return { error: 'User not created' };
    }

    const verificationToken = await generateVerificationToken(db, email);
    await sendVerificationEmail(
      verificationToken.token,
      verificationToken.email
    );

    return { success: 'Confirmation email sent' };
  } catch (error) {
    console.log(error);
    return { error: 'Internal Server Error' };
  } finally {
    db.release();
  }
};

// EMAIL VERIFICATION ACTION

export const newEmailVerification = async (token: string) => {
  const db = await pool.connect();

  try {
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
      [new Date(), tokenExists.email, user.id]
    );
  } catch (error) {
    console.log(error);
    return { error: 'Internal Server Error' };
  } finally {
    db.release();
  }
};
