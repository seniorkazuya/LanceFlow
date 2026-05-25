import { getExceptionInboxSummary } from '@lanceflow/automation';
import { RolePolicy } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

import { withAuthRoute } from '@/lib/api-auth';

/** Control-center summary — CEO and Ops only (CORE-003, AUTO-008). */
export const GET = withAuthRoute('/api/control/summary', RolePolicy.controlCenter, async () => {
  const exceptions = await getExceptionInboxSummary();
  return NextResponse.json({
    scope: 'control-center',
    exceptions,
    message:
      exceptions.open === 0
        ? 'No open leadership exceptions'
        : `${exceptions.open} open exception(s) — ${exceptions.danger} critical, ${exceptions.warning} review`,
  });
});
