'use server';
import { RegType } from '@/components/auth/RegisterForm';
import pool from '@/lib/db';
import { sendVerificationEmail } from '@/lib/mail';
import { RegSchema } from '@/lib/schema';
import { generateVerificationToken } from '@/lib/token-utils';
import { getUserByEmail } from '@/procedures/usersProcedure';
import bcrypt from 'bcryptjs';

export const register = async (formData: RegType) => {
  const db = await pool.connect();
  try {
    const validations = RegSchema.safeParse(formData);

    if (!validations.success) {
      return { error: 'Invalid Fields' };
    }

    const { name, email, password } = validations.data;

    const userExists = await getUserByEmail(email);
    if (userExists) {
      return { error: 'User already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows: userCreated } = await db.query(
      `INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING email`,
      [name, email, hashedPassword]
    );

    if (!userCreated[0]) {
      return { error: 'User not created' };
    }

    const verificationToken = await generateVerificationToken(
      db,
      userCreated[0].email
    );
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
