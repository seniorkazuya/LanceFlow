import { applyEscrowOverride } from '@lanceflow/payments';
import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';
import { parseJsonBody } from '@/lib/clients-api';
import { serializeWorkGatingStatus } from '@/lib/work-gating-api';
import { revalidateProjects } from '@/lib/revalidate-paths';

type RouteContext = { params: Promise<{ id: string }> };

/** Escrow override / manual hold — CEO/Ops with audit (PAY-002). */
export const POST = withApiLogging(
  '/api/projects/[id]/escrow-override',
  async (request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const authz = authorizeRequest(sessionToUser(session), RolePolicy.projectsWrite);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const body = await parseJsonBody<{ action?: string; reason?: string }>(request);
    if (!body?.action) {
      return NextResponse.json(
        { errors: [{ field: 'action', message: 'action is required' }] },
        { status: 400 }
      );
    }

    const result = await applyEscrowOverride(
      id,
      {
        action: body.action as 'release' | 'clear_override' | 'hold' | 'unhold',
        reason: body.reason,
      },
      authz.user.id
    );

    if (!result.ok) {
      const status = result.errors.some((e) => e.field === 'projectId') ? 404 : 400;
      return NextResponse.json({ errors: result.errors }, { status });
    }

    revalidateProjects(id);
    return NextResponse.json({ gating: serializeWorkGatingStatus(result.status) });
  }
);
