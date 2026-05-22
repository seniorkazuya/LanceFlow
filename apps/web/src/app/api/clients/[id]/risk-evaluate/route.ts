import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { evaluateClientRisk } from '@lanceflow/operations';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { serializeClient } from '@/lib/clients-api';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';
import { revalidateClients } from '@/lib/revalidate-paths';

type RouteContext = { params: Promise<{ id: string }> };

export const POST = withApiLogging(
  '/api/clients/[id]/risk-evaluate',
  async (_request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const user = sessionToUser(session);
    const authz = authorizeRequest(user, RolePolicy.clientsWrite);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const result = await evaluateClientRisk(id, authz.user.id);
    if (!result.ok) {
      const status = result.errors.some((e) => e.field === 'id') ? 404 : 400;
      return NextResponse.json({ errors: result.errors }, { status });
    }

    revalidateClients(id);
    return NextResponse.json({ client: serializeClient(result.client) });
  }
);
