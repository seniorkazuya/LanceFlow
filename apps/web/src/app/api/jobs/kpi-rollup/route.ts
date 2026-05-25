import { processKpiRollup } from '@lanceflow/analytics';
import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';

/** Manual / staging trigger for KPI-002 nightly rollup. */
export const POST = withApiLogging('/api/jobs/kpi-rollup', async () => {
  const session = await getAuthSession();
  const authz = authorizeRequest(sessionToUser(session), RolePolicy.controlCenter);
  if (!authz.ok) {
    return NextResponse.json({ error: authz.error }, { status: authz.status });
  }

  const result = await processKpiRollup(new Date(), authz.user.id);

  return NextResponse.json({
    periodKey: result.periodKey,
    scanned: result.scanned,
    upsertedCount: result.upserted.length,
    upserted: result.upserted,
  });
});
