import {
  getHiringDecisionDetail,
  overrideHiringDecision,
} from '@lanceflow/hiring';
import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';

type RouteContext = { params: Promise<{ id: string }> };

export const GET = withApiLogging(
  '/api/hiring/applications/[id]/decision',
  async (_request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const authz = authorizeRequest(sessionToUser(session), RolePolicy.hiringPipelineRead);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const detail = await getHiringDecisionDetail(id);
    if (!detail) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(detail);
  }
);

export const PATCH = withApiLogging(
  '/api/hiring/applications/[id]/decision',
  async (request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const authz = authorizeRequest(sessionToUser(session), RolePolicy.hiringApplicationsManage);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const body = (await request.json().catch(() => null)) as {
      decision?: string;
      reason?: string;
    } | null;

    const result = await overrideHiringDecision(
      id,
      { decision: body?.decision ?? '', reason: body?.reason ?? '' },
      authz.user.id
    );

    if (!result.ok) {
      const status = result.errors.some((e) => e.field === 'applicationId') ? 404 : 400;
      return NextResponse.json({ errors: result.errors }, { status });
    }

    return NextResponse.json({
      application: result.application,
      decisionId: result.decisionId,
    });
  }
);
