import { markNotificationRead } from '@lanceflow/automation';
import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';
import { serializeNotification } from '@/lib/notifications-api';

type RouteContext = { params: Promise<{ id: string }> };

export const POST = withApiLogging(
  '/api/notifications/[id]/read',
  async (_request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const authz = authorizeRequest(sessionToUser(session), RolePolicy.authenticated);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const result = await markNotificationRead(id, authz.user.id);
    if (!result.ok) {
      return NextResponse.json({ errors: result.errors }, { status: 404 });
    }

    return NextResponse.json({ notification: serializeNotification(result.notification) });
  }
);
