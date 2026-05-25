import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { listProjectMilestones, setProjectMilestones } from '@lanceflow/payments';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';
import { parseJsonBody } from '@/lib/clients-api';
import { serializeProjectMilestone } from '@/lib/project-milestones-api';
import { revalidateProjects } from '@/lib/revalidate-paths';

type RouteContext = { params: Promise<{ id: string }> };

export const GET = withApiLogging(
  '/api/projects/[id]/milestones',
  async (_request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const authz = authorizeRequest(sessionToUser(session), RolePolicy.projectsRead);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const items = await listProjectMilestones(id);
    if (items === null) {
      return NextResponse.json(
        { errors: [{ field: 'projectId', message: 'Project not found' }] },
        { status: 404 }
      );
    }

    const totalPercent = items.reduce((s, m) => s + m.percentPct, 0);
    return NextResponse.json({
      items: items.map(serializeProjectMilestone),
      totalPercent,
    });
  }
);

export const PUT = withApiLogging(
  '/api/projects/[id]/milestones',
  async (request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const authz = authorizeRequest(sessionToUser(session), RolePolicy.projectsWrite);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const body = await parseJsonBody<{
      milestones?: { label?: string; percentPct?: number; dueDate?: string | null; amountCents?: number | null }[];
    }>(request);

    if (!body?.milestones || !Array.isArray(body.milestones)) {
      return NextResponse.json(
        { errors: [{ field: 'milestones', message: 'milestones array is required' }] },
        { status: 400 }
      );
    }

    const result = await setProjectMilestones(
      id,
      {
        milestones: body.milestones.map((m) => ({
          label: m.label ?? '',
          percentPct: m.percentPct ?? 0,
          dueDate: m.dueDate ?? null,
          amountCents: m.amountCents ?? null,
        })),
      },
      authz.user.id
    );

    if (!result.ok) {
      const status = result.errors.some((e) => e.field === 'projectId') ? 404 : 400;
      return NextResponse.json({ errors: result.errors }, { status });
    }

    revalidateProjects(id);
    return NextResponse.json({
      items: result.milestones.map(serializeProjectMilestone),
      totalPercent: result.totalPercent,
    });
  }
);
