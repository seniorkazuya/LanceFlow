import { getHiringCeoQueueSnapshot } from '@lanceflow/hiring';
import { RolePolicy } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

import { withAuthRoute } from '@/lib/api-auth';

/** CEO hiring queue — filtered exceptions only (HIRE-007). */
export const GET = withAuthRoute(
  '/api/hiring/ceo-queue',
  RolePolicy.hiringCeoQueue,
  async () => {
    const snapshot = await getHiringCeoQueueSnapshot();
    return NextResponse.json(snapshot);
  }
);
