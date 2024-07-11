import PostgresAdapter from '@auth/pg-adapter';
import NextAuth from 'next-auth';
import pool from './lib/db';
import authConfig from './auth.config';

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PostgresAdapter(pool),
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
  ...authConfig,
});
