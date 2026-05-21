import { GlassCard, StatusBadge, statusToLevel } from '@lanceflow/ui';

import { auth } from '@/auth';

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Signed in as <span className="text-foreground">{session?.user?.email}</span>
        </p>
      </div>
      <GlassCard className="p-4">
        <h2 className="text-sm font-medium text-muted-foreground">System status</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <StatusBadge status="success" label="Platform" />
          <StatusBadge status="warning" label="Exceptions queue" />
          <StatusBadge status={statusToLevel('error')} label="Blocked payouts" />
        </div>
      </GlassCard>
      <p className="text-sm text-muted-foreground">
        Use the sidebar — navigation items match your role (CORE-004).
      </p>
    </div>
  );
}
