import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { getProjectById, updateProject } from '@lanceflow/operations';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { parseJsonBody } from '@/lib/clients-api';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';
import { serializeProject } from '@/lib/projects-api';
import { revalidateProjects } from '@/lib/revalidate-paths';

type RouteContext = { params: Promise<{ id: string }> };

export const GET = withApiLogging('/api/projects/[id]', async (_request: Request, context?: unknown) => {
  const session = await getAuthSession();
  const authz = authorizeRequest(sessionToUser(session), RolePolicy.projectsRead);
  if (!authz.ok) {
    return NextResponse.json({ error: authz.error }, { status: authz.status });
  }

  const { id } = await (context as RouteContext).params;
  const project = await getProjectById(id);
  if (!project) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ project: serializeProject(project) });
});

export const PATCH = withApiLogging('/api/projects/[id]', async (request: Request, context?: unknown) => {
  const session = await getAuthSession();
  const authz = authorizeRequest(sessionToUser(session), RolePolicy.projectsWrite);
  if (!authz.ok) {
    return NextResponse.json({ error: authz.error }, { status: authz.status });
  }

  const { id } = await (context as RouteContext).params;
  const body = await parseJsonBody<{
    title?: string;
    scopeClarityPct?: number | null;
    profitMarginPct?: number | null;
  }>(request);

  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const result = await updateProject(id, body, authz.user.id);
  if (!result.ok) {
    const status = result.errors.some((e) => e.field === 'id') ? 404 : 400;
    return NextResponse.json({ errors: result.errors }, { status });
  }

  revalidateProjects(id);
  return NextResponse.json({ project: serializeProject(result.project) });
});
