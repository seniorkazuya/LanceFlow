import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { runProjectAutoAssignOnActivate } from '@lanceflow/automation';
import { transitionProject } from '@lanceflow/operations';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { parseJsonBody } from '@/lib/clients-api';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';
import { serializeProject } from '@/lib/projects-api';
import { revalidateProjects } from '@/lib/revalidate-paths';

type RouteContext = { params: Promise<{ id: string }> };

export const POST = withApiLogging(
  '/api/projects/[id]/transition',
  async (request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const authz = authorizeRequest(sessionToUser(session), RolePolicy.projectsWrite);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const body = await parseJsonBody<{ status?: string }>(request);
    if (!body?.status) {
      return NextResponse.json({ errors: [{ field: 'status', message: 'status is required' }] }, { status: 400 });
    }

    const result = await transitionProject(id, body.status, authz.user.id);
    if (!result.ok) {
      const status = result.errors.some((e) => e.field === 'id') ? 404 : 400;
      return NextResponse.json({ errors: result.errors }, { status });
    }

    if (body.status === 'active') {
      await runProjectAutoAssignOnActivate(id, authz.user.id);
    }

    revalidateProjects(id);
    return NextResponse.json({ project: serializeProject(result.project) });
  }
);
