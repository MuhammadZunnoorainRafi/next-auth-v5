'use server';

import { signIn } from '@/auth';
import { LogType } from '@/components/auth/LoginForm';
import { RegType } from '@/components/auth/RegisterForm';
import pool from '@/lib/db';
import { LogSchema, RegSchema } from '@/lib/schema';
import { getUserByEmail } from '@/procedures/usersProcedure';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

export const login = async (formData: LogType) => {
  const validations = LogSchema.safeParse(formData);
  if (!validations.success) {
    return { error: 'Invalid Fields' };
  }
  const { email, password } = validations.data;
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
        case 'AccessDenied':
          return { error: error.message };
        case 'OAuthSignInError':
          return { error: error.message };
        case 'CallbackRouteError':
          return { error: 'Email or Password Incorrect' };
        default:
          return { error: 'Something went wrong while loggin In' };
      }
    }
    throw error;
  }
};

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

    await db.query(
      `INSERT INTO users (name,email,password) VALUES ($1,$2,$3)`,
      [name, email, hashedPassword]
    );
    return { success: 'User created' };
  } catch (error) {
    console.log(error);
    return { error: 'Internal Server Error' };
  } finally {
    db.release();
  }
};
