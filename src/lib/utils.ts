import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import pool from './db';
import { v4 as uuidv4 } from 'uuid';
import { getVerificationTokenByEmail } from '@/procedures/tokensProcedure';
import { PoolClient } from 'pg';
import { VerificationToken } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateVerificationToken = async (
  db: PoolClient,
  email: string
): Promise<VerificationToken> => {
  const values = {
    token: uuidv4(),
    email: email,
    expires: new Date(new Date().getTime() + 3600 * 1000),
  };

  const tokenExists = await getVerificationTokenByEmail(db, email);
  if (tokenExists) {
    await db.query(`DELETE FROM verification_token WHERE id = $1`, [
      tokenExists.id,
    ]);
  }

  const { rows } = await db.query(
    `INSERT INTO verification_token (token,email,expires) VALUES ($1,$2,$3) RETURNING *`,
    Object.values(values)
  );

  return rows[0];
};
