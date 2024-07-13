import pool from '@/lib/db';
import { VerificationToken } from '@/lib/types';
import { PoolClient } from 'pg';

export const getVerificationTokenByToken = async (
  db: PoolClient,
  token: string
): Promise<VerificationToken> => {
  const { rows } = await db.query(
    `SELECT * FROM verification_token WHERE token = $1`,
    [token]
  );
  return rows[0];
};

export const getVerificationTokenByEmail = async (
  db: PoolClient,
  email: string
): Promise<VerificationToken> => {
  const { rows } = await db.query(
    `SELECT * FROM verification_token WHERE email = $1`,
    [email]
  );
  return rows[0];
};
