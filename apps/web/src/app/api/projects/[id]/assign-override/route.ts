import { overrideProjectAutoAssign } from '@lanceflow/automation';
import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';
import { parseJsonBody } from '@/lib/clients-api';
import { revalidateProjects } from '@/lib/revalidate-paths';

type RouteContext = { params: Promise<{ id: string }> };

export const POST = withApiLogging(
  '/api/projects/[id]/assign-override',
  async (request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const authz = authorizeRequest(sessionToUser(session), RolePolicy.projectsWrite);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const body = await parseJsonBody<{
      userId?: string;
      reason?: string;
      requiredSkills?: string[];
    }>(request);

    if (!body) {
      return NextResponse.json(
        { errors: [{ field: 'body', message: 'Invalid JSON body' }] },
        { status: 400 }
      );
    }

    const result = await overrideProjectAutoAssign(
      id,
      {
        userId: body.userId ?? '',
        reason: body.reason ?? '',
        requiredSkills: body.requiredSkills,
      },
      authz.user.id
    );

    if (!result.ok) {
      const status = result.errors.some((e) => e.field === 'projectId') ? 404 : 400;
      return NextResponse.json({ errors: result.errors }, { status });
    }

    revalidateProjects(id);

    return NextResponse.json({
      assignmentId: result.assignmentId,
      decision: {
        id: result.decision.id,
        outcome: result.decision.outcome,
        createdAt: result.decision.createdAt.toISOString(),
      },
    });
  }
);
