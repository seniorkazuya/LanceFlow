import { RolePolicy } from '@lanceflow/auth';
import { createClient, listClients } from '@lanceflow/operations';
import { NextResponse } from 'next/server';

import { parseJsonBody, serializeClient } from '@/lib/clients-api';
import { withAuthRoute } from '@/lib/api-auth';
import { revalidateClients } from '@/lib/revalidate-paths';

/** List clients — Ops, CEO, Bidder read (OPS-001). */
export const GET = withAuthRoute('/api/clients', RolePolicy.clientsRead, async (request) => {
  const { searchParams } = new URL(request.url);
  const includeArchived = searchParams.get('includeArchived') === 'true';
  const clients = await listClients(includeArchived);
  return NextResponse.json({ items: clients.map(serializeClient) });
});

/** Create client — Ops write (OPS-001). */
export const POST = withAuthRoute('/api/clients', RolePolicy.clientsWrite, async (request, { user }) => {
  const body = await parseJsonBody<{
    name?: string;
    contactEmail?: string | null;
    riskScore?: number;
    notes?: string | null;
  }>(request);

  if (!body?.name) {
    return NextResponse.json({ errors: [{ field: 'name', message: 'Name is required' }] }, { status: 400 });
  }

  const result = await createClient(
    {
      name: body.name,
      contactEmail: body.contactEmail,
      riskScore: body.riskScore,
      notes: body.notes,
    },
    user.id
  );

  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  revalidateClients(result.client.id);
  return NextResponse.json({ client: serializeClient(result.client) }, { status: 201 });
});
