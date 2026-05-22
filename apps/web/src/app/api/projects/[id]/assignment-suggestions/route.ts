import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { suggestEngineersForProject } from '@lanceflow/operations';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';
import { serializeSuggestion } from '@/lib/assignments-api';

type RouteContext = { params: Promise<{ id: string }> };

export const GET = withApiLogging(
  '/api/projects/[id]/assignment-suggestions',
  async (request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const authz = authorizeRequest(sessionToUser(session), RolePolicy.projectsWrite);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const { searchParams } = new URL(request.url);
    const skillsParam = searchParams.get('skills') ?? '';
    const requiredSkills = skillsParam
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const suggestions = await suggestEngineersForProject(id, requiredSkills);
    if (!suggestions) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ items: suggestions.map(serializeSuggestion) });
  }
);
