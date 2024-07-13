import pool from '@/lib/db';

export const getVerificationTokenByToken = async (token: string) => {
  const db = await pool.connect();
  const { rows } = await db.query(
    `SELECT * FROM verification_token WHERE token = $1`,
    [token]
  );
  db.release();
  return rows[0];
};

export const getVerificationTokenByEmail = async (email: string) => {
  const db = await pool.connect();
  const { rows } = await db.query(
    `SELECT * FROM verification_token WHERE email = $1`,
    [email]
  );
  db.release();
  return rows[0];
};
