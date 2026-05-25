import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { transitionProjectDispute } from '@lanceflow/operations';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';
import { parseJsonBody } from '@/lib/clients-api';
import { serializeProjectDispute } from '@/lib/project-disputes-api';
import { revalidateProjects } from '@/lib/revalidate-paths';

type RouteContext = { params: Promise<{ id: string }> };

export const POST = withApiLogging(
  '/api/disputes/[id]/transition',
  async (request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const authz = authorizeRequest(sessionToUser(session), RolePolicy.projectsWrite);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const body = await parseJsonBody<{
      status?: string;
      resolutionNote?: string | null;
    }>(request);

    if (!body?.status) {
      return NextResponse.json(
        { errors: [{ field: 'status', message: 'status is required' }] },
        { status: 400 }
      );
    }

    const result = await transitionProjectDispute(
      id,
      {
        status: body.status as 'open' | 'investigating' | 'escalated' | 'resolved',
        resolutionNote: body.resolutionNote,
      },
      authz.user.id
    );

    if (!result.ok) {
      const status = result.errors.some((e) => e.field === 'disputeId') ? 404 : 400;
      return NextResponse.json({ errors: result.errors }, { status: status });
    }

    revalidateProjects(result.dispute.projectId);
    return NextResponse.json({ dispute: serializeProjectDispute(result.dispute) });
  }
);
