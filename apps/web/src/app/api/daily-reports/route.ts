import { RolePolicy } from '@lanceflow/auth';
import {
  listEngineerAssignmentOptions,
  listReportsForUserOnDate,
  submitDailyReport,
} from '@lanceflow/operations';
import { NextResponse } from 'next/server';

import { parseJsonBody } from '@/lib/clients-api';
import { serializeDailyReport } from '@/lib/daily-reports-api';
import { withAuthRoute } from '@/lib/api-auth';
import { revalidateDailyReports } from '@/lib/revalidate-paths';

/** Today's reports for the signed-in engineer (OPS-006). */
export const GET = withAuthRoute('/api/daily-reports', RolePolicy.dailyReportsSubmit, async (_req, { user }) => {
  const [assignments, reports] = await Promise.all([
    listEngineerAssignmentOptions(user.id),
    listReportsForUserOnDate(user.id),
  ]);
  return NextResponse.json({
    assignments,
    reports: reports.map(serializeDailyReport),
  });
});

export const POST = withAuthRoute('/api/daily-reports', RolePolicy.dailyReportsSubmit, async (request, { user }) => {
  const body = await parseJsonBody<{
    projectId?: string;
    hours?: number;
    progressPct?: number;
    issues?: string | null;
  }>(request);

  if (!body?.projectId) {
    return NextResponse.json(
      { errors: [{ field: 'projectId', message: 'projectId is required' }] },
      { status: 400 }
    );
  }

  const result = await submitDailyReport(
    user.id,
    {
      projectId: body.projectId,
      hours: body.hours ?? 0,
      progressPct: body.progressPct ?? 0,
      issues: body.issues,
    },
    user.id
  );

  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  revalidateDailyReports();
  return NextResponse.json({ report: serializeDailyReport(result.report) }, { status: 201 });
});
