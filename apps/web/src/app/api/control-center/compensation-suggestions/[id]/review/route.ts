import { reviewCompensationSuggestion } from '@lanceflow/analytics';
import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';
import { serializeCompensationSuggestion } from '@/lib/compensation-suggestions-api';

type RouteContext = { params: Promise<{ id: string }> };

/** Approve or reject a compensation suggestion — CEO/Ops with audit (KPI-006). */
export const POST = withApiLogging(
  '/api/control-center/compensation-suggestions/[id]/review',
  async (request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const authz = authorizeRequest(sessionToUser(session), RolePolicy.controlCenter);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    let body: { action?: string; note?: string };
    try {
      body = (await request.json()) as { action?: string; note?: string };
    } catch {
      return NextResponse.json({ errors: [{ field: 'body', message: 'Invalid JSON' }] }, { status: 400 });
    }

    if (!body.action) {
      return NextResponse.json(
        { errors: [{ field: 'action', message: 'action is required (approve or reject)' }] },
        { status: 400 }
      );
    }

    const result = await reviewCompensationSuggestion(
      id,
      { action: body.action as 'approve' | 'reject', note: body.note },
      authz.user.id
    );

    if (!result.ok) {
      const status = result.errors.some((e) => e.field === 'id') ? 404 : 400;
      return NextResponse.json({ errors: result.errors }, { status });
    }

    return NextResponse.json({ suggestion: serializeCompensationSuggestion(result.suggestion) });
  }
);
