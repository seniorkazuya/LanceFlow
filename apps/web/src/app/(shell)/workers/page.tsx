import { RolePolicy, hasRole } from '@lanceflow/auth';
import { listWorkersWithWorkload } from '@lanceflow/operations';
import { GlassCard, PageHeader, StatusBadge } from '@lanceflow/ui';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ShellPage } from '@/components/app/shell-page';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

function workloadLevel(count: number): 'success' | 'warning' | 'danger' {
  if (count === 0) return 'success';
  if (count <= 2) return 'warning';
  return 'danger';
}

export default async function WorkersPage() {
  const session = await auth();
  const role = session?.user?.role ?? '';
  if (!hasRole(role, RolePolicy.workersRead)) {
    redirect('/dashboard');
  }

  const workers = await listWorkersWithWorkload();

  return (
    <ShellPage>
      <PageHeader
        label="operations"
        title="Team workload"
        description="Engineer skill tags and active assignment counts — workload drives assignment ranking."
      />

      <GlassCard className="overflow-hidden p-0">
        {workers.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">
            No active engineers in the directory. Sign in once with an account whose role is{' '}
            <strong className="font-medium text-foreground">ENGINEER</strong> to create a user record,
            then add skill tags on their profile.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {workers.map((worker) => (
              <li key={worker.id}>
                <Link
                  href={`/workers/${worker.id}`}
                  className="lf-list-hover flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-foreground">{worker.displayName}</p>
                    <p className="text-sm text-muted-foreground">{worker.email}</p>
                    {worker.skillTags.length > 0 ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {worker.skillTags.join(' · ')}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-muted-foreground italic">No skills tagged yet</p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge
                      status={workloadLevel(worker.activeAssignmentCount)}
                      label={`${worker.activeAssignmentCount} active`}
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </ShellPage>
  );
}
