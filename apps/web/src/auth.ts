import { auditLog } from '@lanceflow/audit';
import {
  authenticatePortalUser,
  findOrCreateUserForSignIn,
  resolveDevAuthConfig,
  resolveGoogleSignInUser,
  validateDevCredentials,
} from '@lanceflow/auth';
import { AccountType } from '@lanceflow/types';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id';
import { cookies } from 'next/headers';

import { authConfig } from './auth.config';
import { getGoogleOAuthCredentials } from './lib/google-auth-config';
import { loadMonorepoEnv } from './lib/load-monorepo-env';
import { getMicrosoftOAuthCredentials } from './lib/microsoft-auth-config';

loadMonorepoEnv();

const nextAuth = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: [
    ...((): ReturnType<typeof import('next-auth/providers/google').default>[] => {
      const google = getGoogleOAuthCredentials();
      if (!google) return [];
      return [
        Google({
          clientId: google.clientId,
          clientSecret: google.clientSecret,
          allowDangerousEmailAccountLinking: true,
        }),
      ];
    })(),
    ...((): ReturnType<typeof import('next-auth/providers/microsoft-entra-id').default>[] => {
      const microsoft = getMicrosoftOAuthCredentials();
      if (!microsoft) return [];
      return [
        MicrosoftEntraID({
          clientId: microsoft.clientId,
          clientSecret: microsoft.clientSecret,
          issuer: `https://login.microsoftonline.com/${microsoft.tenantId}/v2.0`,
          allowDangerousEmailAccountLinking: true,
        }),
      ];
    })(),
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
                payload: { email: portalUser.email, role: portalUser.role, provider: 'credentials' },
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
              payload: { email: user.email, role: user.role, provider: 'credentials' },
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
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      const provider = account?.provider;
      if (provider !== 'google' && provider !== 'microsoft-entra-id') return true;
      if (!user.email) return false;

      const jar = await cookies();
      const rawType = jar.get('portal_account_type')?.value;
      const accountType =
        rawType === AccountType.CLIENT || rawType === AccountType.DEVELOPER ? rawType : undefined;

      const result = await resolveGoogleSignInUser({
        email: user.email,
        displayName: user.name ?? undefined,
        accountType,
      });

      jar.delete('portal_account_type');

      if (!result) return false;
      if (result.kind === 'redirect') return result.url;

      user.id = result.user.id;
      user.role = result.user.role;
      user.name = result.user.displayName;

      const providerLabel = provider === 'google' ? 'google' : 'microsoft';

      try {
        await auditLog({
          actorId: result.user.id,
          action: 'auth.sign_in',
          entityType: 'user',
          entityId: result.user.id,
          payload: { email: result.user.email, role: result.user.role, provider: providerLabel },
        });
      } catch (auditError) {
        console.error('[auth] auditLog auth.sign_in failed', auditError);
      }

      return true;
    },
  },
});

export const { handlers, signIn, signOut, auth } = nextAuth;

export async function getAuthSession() {
  return nextAuth.auth();
}

export { isGoogleAuthConfigured } from './lib/google-auth-config';
export { isMicrosoftAuthConfigured } from './lib/microsoft-auth-config';
