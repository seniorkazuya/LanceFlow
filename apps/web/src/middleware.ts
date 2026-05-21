import NextAuth from 'next-auth';

import { authConfig } from './auth.config';

/** Edge-safe middleware — no Prisma (see auth.ts for full handlers). */
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ['/dashboard/:path*', '/auth/signin'],
};
