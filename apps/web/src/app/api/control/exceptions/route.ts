import {
  getExceptionInboxSummary,
  listLeadershipExceptions,
  syncLeadershipExceptions,
} from '@lanceflow/automation';
import { RolePolicy } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

import { withAuthRoute } from '@/lib/api-auth';
import { serializeException } from '@/lib/exceptions-api';

/** Leadership exception inbox — CEO and Ops only (AUTO-008). */
export const GET = withAuthRoute(
  '/api/control/exceptions',
  RolePolicy.controlCenter,
  async (request) => {
    const url = new URL(request.url);
    const sync = url.searchParams.get('sync') === 'true';
    const status = url.searchParams.get('status') ?? 'active';

    const summary = sync
      ? await syncLeadershipExceptions()
      : await getExceptionInboxSummary();

    const items = await listLeadershipExceptions({
      status: status === 'all' ? undefined : (status as 'active' | 'open' | 'acknowledged'),
    });

    return NextResponse.json({
      summary,
      items: items.map(serializeException),
    });
  }
);

export const POST = withAuthRoute(
  '/api/control/exceptions',
  RolePolicy.controlCenter,
  async () => {
    const summary = await syncLeadershipExceptions();
    const items = await listLeadershipExceptions({ status: 'active' });
    return NextResponse.json({
      summary,
      items: items.map(serializeException),
    });
  }
);
