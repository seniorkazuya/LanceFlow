import {
  findOrCreateUserForSignIn,
  resolveDevAuthConfig,
  validateDevCredentials,
} from '@lanceflow/auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { authConfig } from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: [
    Credentials({
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

        const user = await findOrCreateUserForSignIn({ email });
        return {
          id: user.id,
          email: user.email,
          name: user.displayName,
          role: user.role,
        };
      },
    }),
  ],
});
