import { queryAuditLogs } from '@lanceflow/audit';
import { RolePolicy, hasRole } from '@lanceflow/auth';
import { GlassCard, PageHeader, SectionLabel } from '@lanceflow/ui';
import { redirect } from 'next/navigation';

import { ShellPage } from '@/components/app/shell-page';
import { auth } from '@/auth';

export default async function AuditPage() {
  const session = await auth();
  const role = session?.user?.role ?? '';
  if (!hasRole(role, RolePolicy.auditRead)) {
    redirect('/dashboard');
  }

  const page = await queryAuditLogs({ page: 1, pageSize: 25 });

  return (
    <ShellPage>
      <PageHeader
        label="compliance"
        title="Audit Log"
        description="Immutable record of sensitive actions — CEO read-only. New entries appear after sign-in and future mutations."
      />

      <GlassCard className="overflow-hidden p-0">
        <div className="border-b border-white/[0.06] px-5 py-4">
          <SectionLabel>recent events</SectionLabel>
          <p className="mt-1 text-xs text-muted-foreground">
            {page.total} total · page {page.page} · {page.pageSize} per page
          </p>
        </div>
        {page.items.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">
            No audit entries yet. Sign in once to record <code className="text-primary/90">auth.sign_in</code>.
          </p>
        ) : (
          <ul className="divide-y divide-white/[0.06]">
            {page.items.map((row) => (
              <li key={row.id} className="px-5 py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-mono text-sm text-foreground">{row.action}</span>
                  <time className="text-xs text-muted-foreground" dateTime={row.createdAt.toISOString()}>
                    {row.createdAt.toLocaleString()}
                  </time>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {row.entityType}
                  {row.entityId ? ` · ${row.entityId}` : ''}
                  {row.actorId ? ` · actor ${row.actorId.slice(0, 8)}…` : ''}
                </p>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>

      <p className="text-xs text-muted-foreground">
        API: <code className="text-primary/90">GET /api/audit/logs?page=1&amp;pageSize=20</code> (CEO session
        required)
      </p>
    </ShellPage>
  );
}
