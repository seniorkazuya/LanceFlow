import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { createProjectDispute, listProjectDisputes } from '@lanceflow/operations';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';
import { parseJsonBody } from '@/lib/clients-api';
import { serializeProjectDispute } from '@/lib/project-disputes-api';
import { revalidateProjects } from '@/lib/revalidate-paths';

type RouteContext = { params: Promise<{ id: string }> };

export const GET = withApiLogging(
  '/api/projects/[id]/disputes',
  async (_request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const authz = authorizeRequest(sessionToUser(session), RolePolicy.projectsRead);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const items = await listProjectDisputes(id);
    if (items === null) {
      return NextResponse.json(
        { errors: [{ field: 'projectId', message: 'Project not found' }] },
        { status: 404 }
      );
    }

    return NextResponse.json({ items: items.map(serializeProjectDispute) });
  }
);

export const POST = withApiLogging(
  '/api/projects/[id]/disputes',
  async (request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const authz = authorizeRequest(sessionToUser(session), RolePolicy.projectsWrite);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const body = await parseJsonBody<{
      title?: string;
      description?: string | null;
      amountCents?: number;
      currency?: string;
    }>(request);

    const result = await createProjectDispute(
      id,
      {
        title: body?.title ?? '',
        description: body?.description,
        amountCents: body?.amountCents ?? 0,
        currency: body?.currency,
      },
      authz.user.id
    );

    if (!result.ok) {
      const status = result.errors.some((e) => e.field === 'projectId') ? 404 : 400;
      return NextResponse.json({ errors: result.errors }, { status });
    }

    revalidateProjects(id);
    return NextResponse.json({ dispute: serializeProjectDispute(result.dispute) }, { status: 201 });
  }
);
