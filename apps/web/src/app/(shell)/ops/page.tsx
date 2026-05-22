import { RolePolicy, hasRole } from '@lanceflow/auth';
import { getOpsConsoleSnapshot } from '@lanceflow/operations';
import { Button, GlassCard, PageHeader, StatusBadge } from '@lanceflow/ui';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ShellPage } from '@/components/app/shell-page';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

function projectStatusTone(status: string): 'neutral' | 'warning' | 'success' {
  if (status === 'active') return 'success';
  if (status === 'pending_approval') return 'warning';
  return 'neutral';
}

export default async function OpsConsolePage() {
  const session = await auth();
  const role = session?.user?.role ?? '';
  if (!hasRole(role, RolePolicy.opsConsoleRead)) {
    redirect('/dashboard');
  }

  const snapshot = await getOpsConsoleSnapshot();
  const pending = snapshot.projectCounts.pending_approval ?? 0;
  const active = snapshot.projectCounts.active ?? 0;

  return (
    <ShellPage>
      <PageHeader
        label="operations"
        title="Ops console"
        description="Workflow dashboard — projects awaiting action, missing daily reports, and active assignments."
        action={
          <Button asChild size="sm" variant="outline">
            <Link href="/projects/new">New project</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <GlassCard className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Pending approval
          </p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{pending}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Active projects
          </p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{active}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Missing reports (UTC {snapshot.reportDate})
          </p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {snapshot.missingReports.length}
          </p>
        </GlassCard>
      </div>

      <GlassCard className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold text-foreground">Projects in workflow</h2>
          <Link href="/projects" className="text-xs text-primary hover:underline">
            All projects
          </Link>
        </div>
        {snapshot.workflowProjects.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted-foreground">
            No projects in pending approval or active.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {snapshot.workflowProjects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/projects/${p.id}`}
                  className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-muted/40"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.clientName}</p>
                  </div>
                  <StatusBadge
                    status={projectStatusTone(p.status)}
                    label={p.status.replace('_', ' ')}
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>

      <GlassCard className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold text-foreground">Missing daily reports</h2>
          <Link
            href="/daily-reports/missing"
            className="text-xs text-primary hover:underline"
          >
            Full queue
          </Link>
        </div>
        {snapshot.missingReports.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted-foreground">
            All assigned engineers submitted for today (UTC).
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {snapshot.missingReports.map((row) => (
              <li key={`${row.userId}-${row.projectId}`} className="px-5 py-3">
                <p className="text-sm font-medium text-foreground">{row.engineerName}</p>
                <p className="text-xs text-muted-foreground">
                  {row.projectTitle} · {row.clientName}
                </p>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>

      <GlassCard className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold text-foreground">Active assignments</h2>
          <Link href="/workers" className="text-xs text-primary hover:underline">
            Team workload
          </Link>
        </div>
        {snapshot.activeAssignments.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted-foreground">
            No engineers assigned on workflow projects.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {snapshot.activeAssignments.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/projects/${a.projectId}`}
                  className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-muted/40"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.engineerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.projectTitle} · {a.clientName}
                    </p>
                  </div>
                  {a.skillScore != null ? (
                    <span className="text-xs text-muted-foreground">
                      skill {a.skillScore}%
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </ShellPage>
  );
}
