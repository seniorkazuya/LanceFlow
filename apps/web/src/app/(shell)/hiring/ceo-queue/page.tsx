import { RolePolicy, hasRole } from '@lanceflow/auth';
import { getHiringCeoQueueSnapshot } from '@lanceflow/hiring';
import { GlassCard, PageHeader, SectionLabel, StatusBadge } from '@lanceflow/ui';
import { redirect } from 'next/navigation';

import { ShellPage } from '@/components/app/shell-page';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export default async function HiringCeoQueuePage() {
  const session = await auth();
  const role = session?.user?.role ?? '';
  if (!hasRole(role, RolePolicy.hiringCeoQueue)) {
    redirect('/dashboard');
  }

  const snapshot = await getHiringCeoQueueSnapshot();

  return (
    <ShellPage>
      <PageHeader
        label="hiring"
        title="Hiring CEO Queue"
        description="Exception-only view: top candidates and high-risk flags (RS/RP)."
      />

      <GlassCard className="p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <SectionLabel>queue summary</SectionLabel>
            <p className="mt-2 text-sm text-muted-foreground">
              Matches API RBAC on <code className="text-primary/90">/api/hiring/ceo-queue</code>
            </p>
          </div>
          <StatusBadge
            status={snapshot.items.length > 0 ? 'warning' : 'success'}
            label={`${snapshot.items.length} queued`}
          />
        </div>
      </GlassCard>

      <div className="space-y-3">
        {snapshot.items.length === 0 ? (
          <GlassCard className="p-5">
            <p className="text-sm text-muted-foreground">
              No candidates meet CEO queue thresholds right now.
            </p>
          </GlassCard>
        ) : (
          snapshot.items.map((row) => (
            <GlassCard key={row.id} className="p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-foreground">{row.fullName}</h2>
                <p className="text-sm text-muted-foreground">{row.roleApplied}</p>
                {row.flags.length > 0 ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Flags: {row.flags.join(' · ')}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-muted-foreground">
                  THS {row.thsScore}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-muted-foreground">
                  RS {row.rsScore}
                </span>
                {row.rpScore !== null ? (
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-muted-foreground">
                    RP {row.rpScore}
                  </span>
                ) : null}
                {row.decision ? (
                  <StatusBadge
                    status={row.decision === 'Reject' ? 'danger' : row.decision === 'Hold' ? 'warning' : 'success'}
                    label={`${row.decision}${row.decisionSource ? ` (${row.decisionSource})` : ''}`}
                  />
                ) : (
                  <StatusBadge status="neutral" label="No decision" />
                )}
              </div>
            </div>
          </GlassCard>
          ))
        )}
      </div>

      <GlassCard variant="strong" className="p-5 md:p-6">
        <SectionLabel>ai hiring pipeline</SectionLabel>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          This queue is designed to cut CEO review volume by 80–90% by surfacing only top candidates
          and high-risk signals.
        </p>
      </GlassCard>
    </ShellPage>
  );
}
