import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { listProjectAssignments } from '@lanceflow/operations';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';
import { serializeAssignment } from '@/lib/assignments-api';

type RouteContext = { params: Promise<{ id: string }> };

export const GET = withApiLogging(
  '/api/projects/[id]/assignments',
  async (_request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const authz = authorizeRequest(sessionToUser(session), RolePolicy.projectsRead);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const items = await listProjectAssignments(id);
    return NextResponse.json({ items: items.map(serializeAssignment) });
  }
);
