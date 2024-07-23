'use server';

import pool from '@/lib/db';

export const enableTwoFA = async (value: boolean, id: string) => {
  const db = await pool.connect();
  console.log({ value, id });
  try {
    await db.query(`UPDATE users SET "isTwoFactorEnabled" = $1 WHERE id = $2`, [
      value,
      id,
    ]);
    return { success: 'DONE' };
  } catch (error) {
    console.log(error);
    return { error: 'Internal Server Error' };
  } finally {
    db.release();
  }
};
