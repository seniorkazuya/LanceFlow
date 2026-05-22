import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { assignEngineerToProject } from '@lanceflow/operations';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';
import { parseJsonBody } from '@/lib/clients-api';
import { serializeAssignment } from '@/lib/assignments-api';

type RouteContext = { params: Promise<{ id: string }> };

export const POST = withApiLogging(
  '/api/projects/[id]/assign',
  async (request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const authz = authorizeRequest(sessionToUser(session), RolePolicy.projectsWrite);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const body = await parseJsonBody<{ userId?: string; requiredSkills?: string[] }>(request);
    if (!body?.userId) {
      return NextResponse.json(
        { errors: [{ field: 'userId', message: 'userId is required' }] },
        { status: 400 }
      );
    }

    const result = await assignEngineerToProject(
      id,
      {
        userId: body.userId,
        requiredSkills: body.requiredSkills ?? [],
      },
      authz.user.id
    );

    if (!result.ok) {
      const status = result.errors.some((e) => e.field === 'projectId') ? 404 : 400;
      return NextResponse.json({ errors: result.errors }, { status });
    }

    return NextResponse.json(
      { assignment: serializeAssignment(result.assignment) },
      { status: 201 }
    );
  }
);
