import { getWorkGatingStatus } from '@lanceflow/payments';
import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';
import { serializeWorkGatingStatus } from '@/lib/work-gating-api';

type RouteContext = { params: Promise<{ id: string }> };

/** Work gating status for a project — projectsRead (PAY-002). */
export const GET = withApiLogging(
  '/api/projects/[id]/work-gating',
  async (_request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const authz = authorizeRequest(sessionToUser(session), RolePolicy.projectsRead);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const result = await getWorkGatingStatus(id);
    if (!result.ok) {
      return NextResponse.json({ errors: result.errors }, { status: 404 });
    }
    return NextResponse.json(serializeWorkGatingStatus(result.status));
  }
);
