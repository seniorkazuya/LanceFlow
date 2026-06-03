import { auditLog } from '@lanceflow/audit';
import {
  authenticatePortalUser,
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
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== 'string' || typeof password !== 'string') return null;

        try {
          const portalUser = await authenticatePortalUser(email, password);
          if (portalUser) {
            try {
              await auditLog({
                actorId: portalUser.id,
                action: 'auth.sign_in',
                entityType: 'user',
                entityId: portalUser.id,
                payload: { email: portalUser.email, role: portalUser.role },
              });
            } catch (auditError) {
              console.error('[auth] auditLog auth.sign_in failed', auditError);
            }
            return {
              id: portalUser.id,
              email: portalUser.email,
              name: portalUser.displayName,
              role: portalUser.role,
            };
          }

          const config = resolveDevAuthConfig();
          if (!config || !validateDevCredentials(email, password, config)) return null;

          const user = await findOrCreateUserForSignIn({ email: config.email });
          try {
            await auditLog({
              actorId: user.id,
              action: 'auth.sign_in',
              entityType: 'user',
              entityId: user.id,
              payload: { email: user.email, role: user.role },
            });
          } catch (auditError) {
            console.error('[auth] auditLog auth.sign_in failed', auditError);
          }
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
