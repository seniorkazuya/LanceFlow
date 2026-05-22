import { RolePolicy, hasRole } from '@lanceflow/auth';
import {
  listEngineerAssignmentOptions,
  listReportsForUserOnDate,
} from '@lanceflow/operations';
import { GlassCard, PageHeader, SectionLabel } from '@lanceflow/ui';
import { redirect } from 'next/navigation';

import { ShellPage } from '@/components/app/shell-page';
import { DailyReportForm } from '@/components/daily-reports/daily-report-form';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export default async function DailyReportsPage() {
  const session = await auth();
  const role = session?.user?.role ?? '';
  if (!hasRole(role, RolePolicy.dailyReportsSubmit)) {
    redirect('/dashboard');
  }

  const userId = session!.user!.id;
  const [assignments, reports] = await Promise.all([
    listEngineerAssignmentOptions(userId),
    listReportsForUserOnDate(userId),
  ]);

  return (
    <ShellPage>
      <PageHeader
        label="operations"
        title="Daily report"
        description="Submit progress for today (UTC). One report per active project assignment per day."
      />

      <GlassCard className="p-5 md:p-6">
        <SectionLabel>submit</SectionLabel>
        <div className="mt-4">
          <DailyReportForm assignments={assignments} />
        </div>
      </GlassCard>

      <GlassCard className="p-5 md:p-6">
        <SectionLabel>today</SectionLabel>
        {reports.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No reports submitted yet today.</p>
        ) : (
          <ul className="mt-4 space-y-3 text-sm">
            {reports.map((r) => (
              <li key={r.id} className="rounded-lg border border-border bg-card/50 px-4 py-3">
                <p className="font-medium text-foreground">{r.projectTitle}</p>
                <p className="text-muted-foreground">
                  {r.hours}h · {r.progressPct}% progress
                </p>
                {r.issues ? <p className="mt-1 text-muted-foreground">{r.issues}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </ShellPage>
  );
}
