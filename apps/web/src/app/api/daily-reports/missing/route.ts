import { RolePolicy } from '@lanceflow/auth';
import { listMissingDailyReports } from '@lanceflow/operations';
import { NextResponse } from 'next/server';

import { serializeMissingReport } from '@/lib/daily-reports-api';
import { withAuthRoute } from '@/lib/api-auth';

/** Assignments without a report for today UTC (OPS-006). */
export const GET = withAuthRoute('/api/daily-reports/missing', RolePolicy.missingReportsRead, async () => {
  const items = await listMissingDailyReports();
  return NextResponse.json({ items: items.map(serializeMissingReport) });
});
