import { RolePolicy, hasRole } from '@lanceflow/auth';
import { listMissingDailyReports } from '@lanceflow/operations';
import { GlassCard, PageHeader, StatusBadge } from '@lanceflow/ui';
import { redirect } from 'next/navigation';

import { ShellPage } from '@/components/app/shell-page';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export default async function MissingDailyReportsPage() {
  const session = await auth();
  const role = session?.user?.role ?? '';
  if (!hasRole(role, RolePolicy.missingReportsRead)) {
    redirect('/dashboard');
  }

  const missing = await listMissingDailyReports();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <ShellPage>
      <PageHeader
        label="operations"
        title="Missing daily reports"
        description={`Active assignments without a report for ${today} (UTC).`}
      />

      <GlassCard className="overflow-hidden p-0">
        {missing.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">
            All active assignments have a report for today.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {missing.map((row) => (
              <li
                key={`${row.userId}-${row.projectId}`}
                className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">{row.engineerName}</p>
                  <p className="text-sm text-muted-foreground">{row.engineerEmail}</p>
                  <p className="mt-1 text-sm">
                    {row.projectTitle} · {row.clientName}
                  </p>
                </div>
                <StatusBadge status="warning" label="Missing" />
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </ShellPage>
  );
}
