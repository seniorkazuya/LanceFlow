import {
  generateCompensationSuggestions,
  listCompensationSuggestions,
} from '@lanceflow/analytics';
import { RolePolicy } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

import { withAuthRoute } from '@/lib/api-auth';
import { serializeCompensationSuggestion } from '@/lib/compensation-suggestions-api';

/** List compensation suggestions — CEO/Ops (KPI-006). */
export const GET = withAuthRoute(
  '/api/control-center/compensation-suggestions',
  RolePolicy.controlCenter,
  async (request) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') ?? 'pending';
    const periodKey = url.searchParams.get('periodKey') ?? undefined;
    const items = await listCompensationSuggestions({ status, periodKey });
    return NextResponse.json({ items: items.map(serializeCompensationSuggestion) });
  }
);

/** Generate suggestions from KPI records for the current week — CEO/Ops (KPI-006). */
export const POST = withAuthRoute(
  '/api/control-center/compensation-suggestions',
  RolePolicy.controlCenter,
  async (_request, { user }) => {
    const result = await generateCompensationSuggestions(new Date(), user.id);
    const items = await listCompensationSuggestions({
      status: 'pending',
      periodKey: result.periodKey,
    });
    return NextResponse.json({
      ...result,
      items: items.map(serializeCompensationSuggestion),
    });
  }
);
