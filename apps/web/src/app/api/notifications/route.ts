import { listNotificationsForUser, countUnreadNotifications } from '@lanceflow/automation';
import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';
import { serializeNotification } from '@/lib/notifications-api';

export const GET = withApiLogging('/api/notifications', async (request: Request) => {
  const session = await getAuthSession();
  const authz = authorizeRequest(sessionToUser(session), RolePolicy.authenticated);
  if (!authz.ok) {
    return NextResponse.json({ error: authz.error }, { status: authz.status });
  }

  const url = new URL(request.url);
  const unreadOnly = url.searchParams.get('unreadOnly') === 'true';
  const countOnly = url.searchParams.get('countOnly') === 'true';

  if (countOnly) {
    const unread = await countUnreadNotifications(authz.user.id);
    return NextResponse.json({ unread });
  }

  const items = await listNotificationsForUser(authz.user.id, { unreadOnly });
  const unread = await countUnreadNotifications(authz.user.id);

  return NextResponse.json({
    unread,
    items: items.map(serializeNotification),
  });
});
