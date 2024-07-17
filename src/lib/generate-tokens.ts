import {
  getResetPasswordTokenByEmail,
  getVerificationTokenByEmail,
} from '@/procedures/tokensProcedure';
import { VerificationToken } from './types';
import { PoolClient } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { getTwoFactorTokenByEmail } from '@/procedures/2FAProceduret';

export const generateVerificationToken = async (
  db: PoolClient,
  email: string
): Promise<VerificationToken> => {
  const values = {
    token: uuidv4(),
    email: email,
    expires: new Date(new Date().getTime() + 3600 * 1000),
  };

  const existingToken = await getVerificationTokenByEmail(db, email);
  if (existingToken) {
    await db.query(`DELETE FROM verification_token WHERE id = $1`, [
      existingToken.id,
    ]);
  }

  const { rows } = await db.query(
    `INSERT INTO verification_token (token,email,expires) VALUES ($1,$2,$3) RETURNING *`,
    Object.values(values)
  );

  return rows[0];
};

export const generateResetPasswordToken = async (
  db: PoolClient,
  email: string
): Promise<VerificationToken> => {
  const values = {
    token: uuidv4(),
    email: email,
    expires: new Date(new Date().getTime() + 3600 * 1000),
  };

  const existingToken = await getResetPasswordTokenByEmail(db, email);

  if (existingToken) {
    await db.query(`DELETE FROM password_reset_token WHERE id = $1`, [
      existingToken.id,
    ]);
  }

  const { rows } = await db.query(
    `INSERT INTO password_reset_token(token,email,expires) VALUES ($1,$2,$3) RETURNING *`,
    Object.values(values)
  );

  return rows[0];
};

export const generateTwoFactorToken = async (
  db: PoolClient,
  email: string
): Promise<VerificationToken> => {
  const values = {
    token: crypto.randomInt(100_000, 1_000_000).toString(),
    email: email,
    expires: new Date(new Date().getTime() + 5 * 60 * 1000),
  };

  const existingToken = await getTwoFactorTokenByEmail(db, email);

  if (existingToken) {
    await db.query(`DELETE FROM two_factor_token WHERE id = $1`, [
      existingToken.id,
    ]);
  }

  const { rows } = await db.query(
    `INSERT INTO two_factor_token(token,email,expires) VALUES ($1,$2,$3) RETURNING *`,
    Object.values(values)
  );

  return rows[0];
};
