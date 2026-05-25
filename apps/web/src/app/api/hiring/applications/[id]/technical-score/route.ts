import { setTechnicalScore } from '@lanceflow/hiring';
import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';

type RouteContext = { params: Promise<{ id: string }> };

export const PATCH = withApiLogging(
  '/api/hiring/applications/[id]/technical-score',
  async (request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const authz = authorizeRequest(sessionToUser(session), RolePolicy.hiringApplicationsManage);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const body = (await request.json()) as { technicalScore?: unknown };
    const result = await setTechnicalScore(id, Number(body.technicalScore), 'manual', authz.user.id);

    if (!result.ok) {
      return NextResponse.json({ errors: result.errors }, { status: 400 });
    }

    return NextResponse.json({
      application: {
        id: result.application.id,
        technicalScore: result.application.technicalScore,
        technicalScoreAt: result.application.technicalScoreAt,
        technicalScoreSource: result.application.technicalScoreSource,
        status: result.application.status,
      },
    });
  }
);
