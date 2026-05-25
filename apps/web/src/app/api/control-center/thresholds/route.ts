import { getKpiSignalThresholds, updateKpiSignalThresholds } from '@lanceflow/analytics';
import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

import { withAuthRoute, sessionToUser } from '@/lib/api-auth';
import { getAuthSession } from '@/auth';
import { serializeKpiThresholds } from '@/lib/kpi-thresholds-api';
import { withApiLogging } from '@/lib/api-route';

type ThresholdBody = {
  kpiScore?: { greenMin?: number; yellowMin?: number };
  clientRisk?: { greenMax?: number; yellowMax?: number };
};

/** Read KPI signal thresholds — CEO and Ops (KPI-005). */
export const GET = withAuthRoute(
  '/api/control-center/thresholds',
  RolePolicy.controlCenter,
  async () => {
    const thresholds = await getKpiSignalThresholds();
    return NextResponse.json(serializeKpiThresholds(thresholds));
  }
);

/** Update KPI signal thresholds — CEO only with audit (KPI-005). */
export const PUT = withApiLogging('/api/control-center/thresholds', async (request: Request) => {
  const session = await getAuthSession();
  const user = sessionToUser(session);
  const authz = authorizeRequest(user, RolePolicy.kpiThresholdsWrite);
  if (!authz.ok) {
    return NextResponse.json({ error: authz.error }, { status: authz.status });
  }

  let body: ThresholdBody;
  try {
    body = (await request.json()) as ThresholdBody;
  } catch {
    return NextResponse.json({ errors: [{ field: 'body', message: 'Invalid JSON' }] }, { status: 400 });
  }

  const result = await updateKpiSignalThresholds(body, authz.user.id);
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  return NextResponse.json(serializeKpiThresholds(result.thresholds));
});
