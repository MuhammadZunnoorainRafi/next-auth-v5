import PostgresAdapter from '@auth/pg-adapter';
import NextAuth from 'next-auth';
import pool from './lib/db';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { LogSchema } from './lib/schema';
import {
  getUserByEmail,
  getUserById,
  UserRoleT,
} from './procedures/usersProcedure';
import bcrypt from 'bcryptjs';

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PostgresAdapter(pool),
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
  pages: { signIn: '/auth/login', error: '/auth/error' },
  events: {
    linkAccount: async ({ user }) => {
      const db = await pool.connect();
      await db.query(`UPDATE users SET "emailVerified" = $1 WHERE id = $2`, [
        new Date(),
        user.id,
      ]);
      db.release();
    },
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRoleT;
      }

      return session;
    },
    jwt: async ({ token }) => {
      if (!token.sub) return token;
      const user = await getUserById(token.sub);
      if (!user) return token;
      token.role = user.role;
      return token;
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      authorize: async (credentials) => {
        const validations = LogSchema.safeParse(credentials);
        if (validations.success) {
          const { email, password } = validations.data;
          const user = await getUserByEmail(email);
          if (!user || !user.password) {
            return null;
          }

          const matchedPassword = await bcrypt.compare(password, user.password);
          if (matchedPassword) return user;
        }
        return null;
      },
    }),
  ],
});
