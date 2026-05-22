import { runProjectAutoApproval } from '@lanceflow/automation';
import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';
import { revalidateProjects } from '@/lib/revalidate-paths';

type RouteContext = { params: Promise<{ id: string }> };

export const POST = withApiLogging(
  '/api/projects/[id]/auto-approve',
  async (_request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const authz = authorizeRequest(sessionToUser(session), RolePolicy.projectsWrite);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const result = await runProjectAutoApproval(id, authz.user.id);
    if (!result.ok) {
      const status = result.errors.some((e) => e.field === 'projectId') ? 404 : 400;
      return NextResponse.json({ errors: result.errors }, { status });
    }

    revalidateProjects(id);

    return NextResponse.json({
      approved: result.approved,
      transitioned: result.transitioned,
      projectStatus: result.projectStatus,
      decision: {
        id: result.decision.id,
        outcome: result.decision.outcome,
        formulaVersion: result.decision.formulaVersion,
        explanation: result.decision.explanation,
        createdAt: result.decision.createdAt.toISOString(),
      },
    });
  }
);
