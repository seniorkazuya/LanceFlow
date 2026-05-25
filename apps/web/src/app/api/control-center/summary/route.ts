import { getControlCenterSummary } from '@lanceflow/analytics';
import { RolePolicy } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

import { withAuthRoute } from '@/lib/api-auth';
import { serializeControlCenterSummary } from '@/lib/control-center-api';

/** Control Center summary — CEO and Ops only (KPI-003). */
export const GET = withAuthRoute(
  '/api/control-center/summary',
  RolePolicy.controlCenter,
  async () => {
    const summary = await getControlCenterSummary();
    return NextResponse.json(serializeControlCenterSummary(summary));
  }
);
