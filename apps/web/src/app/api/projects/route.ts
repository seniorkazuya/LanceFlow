import { RolePolicy } from '@lanceflow/auth';
import { createProject, listProjects } from '@lanceflow/operations';
import { NextResponse } from 'next/server';

import { parseJsonBody } from '@/lib/clients-api';
import { withAuthRoute } from '@/lib/api-auth';
import { serializeProject } from '@/lib/projects-api';

export const GET = withAuthRoute('/api/projects', RolePolicy.projectsRead, async () => {
  const projects = await listProjects();
  return NextResponse.json({ items: projects.map(serializeProject) });
});

export const POST = withAuthRoute('/api/projects', RolePolicy.projectsWrite, async (request, { user }) => {
  const body = await parseJsonBody<{
    clientId?: string;
    title?: string;
    scopeClarityPct?: number | null;
    profitMarginPct?: number | null;
  }>(request);

  if (!body?.clientId || !body.title) {
    return NextResponse.json(
      { errors: [{ field: 'title', message: 'clientId and title are required' }] },
      { status: 400 }
    );
  }

  const result = await createProject(
    {
      clientId: body.clientId,
      title: body.title,
      scopeClarityPct: body.scopeClarityPct,
      profitMarginPct: body.profitMarginPct,
    },
    user.id
  );

  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  return NextResponse.json({ project: serializeProject(result.project) }, { status: 201 });
});
