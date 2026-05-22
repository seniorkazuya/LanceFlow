import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { overrideClientRisk } from '@lanceflow/operations';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { parseJsonBody, serializeClient } from '@/lib/clients-api';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';
import { revalidateClients } from '@/lib/revalidate-paths';

type RouteContext = { params: Promise<{ id: string }> };

export const POST = withApiLogging(
  '/api/clients/[id]/risk-override',
  async (request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const user = sessionToUser(session);
    const authz = authorizeRequest(user, RolePolicy.clientsWrite);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const body = await parseJsonBody<{ riskScore?: number; reason?: string }>(request);
    if (body?.riskScore === undefined || !body.reason) {
      return NextResponse.json(
        { errors: [{ field: 'reason', message: 'riskScore and reason are required' }] },
        { status: 400 }
      );
    }

    const result = await overrideClientRisk(
      id,
      { riskScore: body.riskScore, reason: body.reason },
      authz.user.id
    );
    if (!result.ok) {
      const status = result.errors.some((e) => e.field === 'id') ? 404 : 400;
      return NextResponse.json({ errors: result.errors }, { status });
    }

    revalidateClients(id);
    return NextResponse.json({ client: serializeClient(result.client) });
  }
);
