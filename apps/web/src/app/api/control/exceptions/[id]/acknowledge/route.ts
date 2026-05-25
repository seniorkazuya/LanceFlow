import { acknowledgeLeadershipException } from '@lanceflow/automation';
import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';
import { serializeException } from '@/lib/exceptions-api';

type RouteContext = { params: Promise<{ id: string }> };

export const POST = withApiLogging(
  '/api/control/exceptions/[id]/acknowledge',
  async (_request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const authz = authorizeRequest(sessionToUser(session), RolePolicy.controlCenter);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const result = await acknowledgeLeadershipException(id, authz.user.id);
    if (!result.ok) {
      return NextResponse.json({ errors: result.errors }, { status: 404 });
    }
    return NextResponse.json({ exception: serializeException(result.exception) });
  }
);
