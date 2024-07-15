import pool from '@/lib/db';
import { VerificationToken } from '@/lib/types';
import { PoolClient } from 'pg';

// @desc TWO FACTOR TOKEN
export const getTwoFactorTokenByToken = async (
  db: PoolClient,
  token: string
): Promise<VerificationToken> => {
  const { rows } = await db.query(
    `SELECT * FROM two_factor_token WHERE token = $1`,
    [token]
  );
  return rows[0];
};

export const getTwoFactorTokenByEmail = async (
  db: PoolClient,
  email: string
): Promise<VerificationToken> => {
  const { rows } = await db.query(
    `SELECT * FROM two_factor_token WHERE email = $1`,
    [email]
  );
  return rows[0];
};

// @desc TWO FACTOR CONFIRMATION
export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  const db = await pool.connect();
  const { rows } = await db.query(
    `SELECT * FROM two_factor_confirmation WHERE user_id = $1`,
    [userId]
  );
  db.release();
  return rows[0];
};
