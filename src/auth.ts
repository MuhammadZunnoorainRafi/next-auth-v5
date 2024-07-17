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
import { getTwoFactorConfirmationByUserId } from './procedures/2FAProceduret';

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
    signIn: async ({ user, account }) => {
      // Allow OAuth without verification
      if (account?.provider !== 'credentials') return true;

      if (user.id) {
        const userExists = await getUserById(user.id);
        if (!userExists.emailVerified) {
          return false;
        }

        if (userExists.isTwoFactorEnabled) {
          const existingTwoFactorConfirmationUser =
            await getTwoFactorConfirmationByUserId(userExists.id);
          if (!existingTwoFactorConfirmationUser) return false;
          const db = await pool.connect();
          await db.query(
            `DELETE FROM two_factor_confirmation WHERE user_id = $1`,
            [userExists.id]
          );
          db.release();
        }
      } else {
        return false;
      }
      return true;
    },
    session: async ({ session, token }) => {
      if (token.sub && session) {
        session.user.id = token.sub;
      }

      if (token.role && session) {
        session.user.role = token.role as UserRoleT;
      }

      if (session) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      return session;
    },
    jwt: async ({ token }) => {
      if (!token.sub) return token;
      const user = await getUserById(token.sub);
      if (!user) return token;
      token.name = user.name;
      token.email = user.email;
      token.role = user.role;
      token.isTwoFactorEnabled = user.isTwoFactorEnabled;

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
