import {
  findOrCreateUserForSignIn,
  resolveDevAuthConfig,
  validateDevCredentials,
} from '@lanceflow/auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { authConfig } from './auth.config';

const nextAuth = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const config = resolveDevAuthConfig();
        if (!config) return null;

        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== 'string' || typeof password !== 'string') return null;
        if (!validateDevCredentials(email, password, config)) return null;

        try {
          const user = await findOrCreateUserForSignIn({ email: config.email });
          return {
            id: user.id,
            email: user.email,
            name: user.displayName,
            role: user.role,
          };
        } catch (error) {
          console.error('[auth] findOrCreateUserForSignIn failed', error);
          return null;
        }
      },
    }),
  ],
});

export const { handlers, signIn, signOut, auth } = nextAuth;

export async function getAuthSession() {
  return nextAuth.auth();
}
