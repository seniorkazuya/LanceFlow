import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { updateWorkerSkills } from '@lanceflow/operations';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';
import { parseJsonBody } from '@/lib/clients-api';
import { serializeWorker } from '@/lib/workers-api';
import { revalidateWorkers } from '@/lib/revalidate-paths';

type RouteContext = { params: Promise<{ id: string }> };

export const PATCH = withApiLogging(
  '/api/workers/[id]/skills',
  async (request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const authz = authorizeRequest(sessionToUser(session), RolePolicy.workersWrite);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const body = await parseJsonBody<{ skillTags?: string[] }>(request);
    if (!body || body.skillTags === undefined) {
      return NextResponse.json(
        { errors: [{ field: 'skillTags', message: 'skillTags is required' }] },
        { status: 400 }
      );
    }

    const result = await updateWorkerSkills(id, { skillTags: body.skillTags }, authz.user.id);
    if (!result.ok) {
      const status = result.errors.some((e) => e.field === 'id') ? 404 : 400;
      return NextResponse.json({ errors: result.errors }, { status });
    }

    revalidateWorkers(id);
    return NextResponse.json({ worker: serializeWorker(result.worker) });
  }
);
