import { RolePolicy } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

import { withAuthRoute } from '@/lib/api-auth';

/** CEO hiring queue — engineers are denied (CORE-003). */
export const GET = withAuthRoute('/api/hiring/ceo-queue', RolePolicy.hiringCeoQueue, async () => {
  return NextResponse.json({
    scope: 'hiring-ceo-queue',
    items: [],
  });
});
