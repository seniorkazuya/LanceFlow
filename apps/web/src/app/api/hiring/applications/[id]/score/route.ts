import { scoreHiringApplication } from '@lanceflow/hiring';
import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';

type RouteContext = { params: Promise<{ id: string }> };

export const POST = withApiLogging(
  '/api/hiring/applications/[id]/score',
  async (_request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const authz = authorizeRequest(sessionToUser(session), RolePolicy.hiringApplicationsManage);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const result = await scoreHiringApplication(id, authz.user.id);
    if (!result.ok) {
      return NextResponse.json({ errors: result.errors }, { status: 400 });
    }

    return NextResponse.json({
      applicationId: result.application.id,
      ths: result.ths,
      rs: result.rs,
      recommendation: result.recommendation,
      autoRejected: result.autoRejected,
      decisionId: result.decisionId,
      status: result.application.status,
    });
  }
);
