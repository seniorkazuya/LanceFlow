import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { getWorkerById } from '@lanceflow/operations';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';
import { serializeWorker } from '@/lib/workers-api';

type RouteContext = { params: Promise<{ id: string }> };

export const GET = withApiLogging('/api/workers/[id]', async (_request: Request, context?: unknown) => {
  const session = await getAuthSession();
  const authz = authorizeRequest(sessionToUser(session), RolePolicy.workersRead);
  if (!authz.ok) {
    return NextResponse.json({ error: authz.error }, { status: authz.status });
  }

  const { id } = await (context as RouteContext).params;
  const worker = await getWorkerById(id);
  if (!worker) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ worker: serializeWorker(worker) });
});
