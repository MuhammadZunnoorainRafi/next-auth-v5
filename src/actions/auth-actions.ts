'use server';

import { LogType } from '@/components/auth/LoginForm';
import { RegType } from '@/components/auth/RegisterForm';
import pool from '@/lib/db';
import { LogSchema, RegSchema } from '@/lib/schema';
import { getUserByEmail } from '@/procedures/users';
import bcrypt from 'bcrypt';

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

  const { name, email, password } = validations.data;

  const db = await pool.connect();
  try {
    const userExists = await getUserByEmail(db, email);
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
