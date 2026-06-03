import { getHiringPipelineSnapshot, parseHiringPipelineFilters } from '@lanceflow/hiring';
import { RolePolicy } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

import { withAuthRoute } from '@/lib/api-auth';

/** Hiring pipeline dashboard data — CEO/Ops only (HIRE-005). */
export const GET = withAuthRoute(
  '/api/hiring/pipeline',
  RolePolicy.hiringPipelineRead,
  async (request) => {
    const url = new URL(request.url);
    const filters = parseHiringPipelineFilters(
      Object.fromEntries(url.searchParams.entries())
    );
    const snapshot = await getHiringPipelineSnapshot(filters);
    return NextResponse.json(snapshot);
  }
);
