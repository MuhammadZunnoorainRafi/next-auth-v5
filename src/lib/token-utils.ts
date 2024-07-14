import {
  getResetPasswordTokenByEmail,
  getVerificationTokenByEmail,
} from '@/procedures/tokensProcedure';
import { VerificationToken } from './types';
import { PoolClient } from 'pg';
import { v4 as uuidv4 } from 'uuid';

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
