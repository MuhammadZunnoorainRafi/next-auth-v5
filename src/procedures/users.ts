import pool from '@/lib/db';
import { UUID } from 'crypto';
import { PoolClient } from 'pg';

export const getUserByEmail = async (db: PoolClient, email: string) => {
  const { rows } = await db.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  return rows[0];
};

export const getUserById = async (db: PoolClient, id: UUID) => {
  const { rows } = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return rows[0];
};
