import { getControlCenterSummary } from '@lanceflow/analytics';
import { RolePolicy } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

import { withAuthRoute } from '@/lib/api-auth';
import { serializeControlCenterSummary } from '@/lib/control-center-api';

/** Legacy path — delegates to KPI-003 control-center summary. */
export const GET = withAuthRoute('/api/control/summary', RolePolicy.controlCenter, async () => {
  const summary = await getControlCenterSummary();
  return NextResponse.json(serializeControlCenterSummary(summary));
});
