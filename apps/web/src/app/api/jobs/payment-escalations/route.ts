import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { processPaymentEscalations } from '@lanceflow/payments';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';

/** Manual / staging trigger for AUTO-005 payment escalation job. */
export const POST = withApiLogging('/api/jobs/payment-escalations', async () => {
  const session = await getAuthSession();
  const authz = authorizeRequest(sessionToUser(session), RolePolicy.controlCenter);
  if (!authz.ok) {
    return NextResponse.json({ error: authz.error }, { status: authz.status });
  }

  const result = await processPaymentEscalations(new Date(), authz.user.id);

  return NextResponse.json({
    scanned: result.scanned,
    updatedCount: result.updated.length,
    updates: result.updated,
  });
});
