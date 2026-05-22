import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { archiveClient, getClientById, updateClient } from '@lanceflow/operations';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { parseJsonBody, serializeClient } from '@/lib/clients-api';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';
import { revalidateClients } from '@/lib/revalidate-paths';

type RouteContext = { params: Promise<{ id: string }> };

async function authorizeClients(
  allowed: typeof RolePolicy.clientsRead | typeof RolePolicy.clientsWrite
) {
  const session = await getAuthSession();
  const user = sessionToUser(session);
  return authorizeRequest(user, allowed);
}

export const GET = withApiLogging('/api/clients/[id]', async (_request: Request, context?: unknown) => {
    const authz = await authorizeClients(RolePolicy.clientsRead);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const client = await getClientById(id);
    if (!client) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ client: serializeClient(client) });
});

export const PATCH = withApiLogging('/api/clients/[id]', async (request: Request, context?: unknown) => {
    const authz = await authorizeClients(RolePolicy.clientsWrite);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const body = await parseJsonBody<{
      name?: string;
      contactEmail?: string | null;
      status?: 'active' | 'archived';
      notes?: string | null;
    }>(request);

    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const result = await updateClient(id, body, authz.user.id);
    if (!result.ok) {
      const status = result.errors.some((e) => e.field === 'id') ? 404 : 400;
      return NextResponse.json({ errors: result.errors }, { status });
    }

    revalidateClients(id);
    return NextResponse.json({ client: serializeClient(result.client) });
});

export const DELETE = withApiLogging('/api/clients/[id]', async (_request: Request, context?: unknown) => {
    const authz = await authorizeClients(RolePolicy.clientsWrite);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const result = await archiveClient(id, authz.user.id);
    if (!result.ok) {
      return NextResponse.json({ errors: result.errors }, { status: 404 });
    }

    revalidateClients(id);
    return NextResponse.json({ client: serializeClient(result.client) });
});
