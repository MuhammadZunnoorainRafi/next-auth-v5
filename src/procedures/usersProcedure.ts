import pool from '@/lib/db';

export type UserRoleT = 'ADMIN' | 'USER';

export type UserT = {
  id: string;
  name: string;
  email: string;
  role: string;
  password: string;
  isTwoFactorEnabled: boolean;
  emailVerified: Date;
};

export const getUserByEmail = async (email: string): Promise<UserT> => {
  const db = await pool.connect();
  const { rows } = await db.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  db.release();
  return rows[0];
};

export const getUserById = async (id: string): Promise<UserT> => {
  const db = await pool.connect();
  const { rows } = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);
  db.release();
  return rows[0];
};
