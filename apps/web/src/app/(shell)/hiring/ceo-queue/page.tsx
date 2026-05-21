import { GlassCard, PageHeader, SectionLabel, StatusBadge } from '@lanceflow/ui';
import { RolePolicy, hasRole } from '@lanceflow/auth';
import { redirect } from 'next/navigation';

import { ShellPage } from '@/components/app/shell-page';
import { auth } from '@/auth';

const queuePreview = [
  { name: 'Candidate A', role: 'Senior Engineer', ths: 82, rs: 22, band: 'Auto-approve path' },
  { name: 'Candidate B', role: 'Caller', ths: 71, rs: 48, band: 'Manual CEO review' },
  { name: 'Candidate C', role: 'Bidder', ths: 88, rs: 18, band: 'High RP — prioritize' },
] as const;

export default async function HiringCeoQueuePage() {
  const session = await auth();
  const role = session?.user?.role ?? '';
  if (!hasRole(role, RolePolicy.hiringCeoQueue)) {
    redirect('/dashboard');
  }

  return (
    <ShellPage>
      <PageHeader
        label="hiring"
        title="Hiring CEO Queue"
        description="Top and high-risk candidates surface here after THS/RS scoring — engineers are redirected per RBAC."
      />

      <GlassCard className="p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <SectionLabel>queue summary</SectionLabel>
            <p className="mt-2 text-sm text-muted-foreground">
              Matches API RBAC on <code className="text-primary/90">/api/hiring/ceo-queue</code>
            </p>
          </div>
          <StatusBadge status="warning" label="3 pending CEO decisions" />
        </div>
      </GlassCard>

      <div className="space-y-3">
        {queuePreview.map((row) => (
          <GlassCard key={row.name} className="p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-foreground">{row.name}</h2>
                <p className="text-sm text-muted-foreground">{row.role}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-muted-foreground">
                  THS {row.ths}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-muted-foreground">
                  RS {row.rs}
                </span>
                <StatusBadge
                  status={row.rs >= 50 ? 'warning' : 'success'}
                  label={row.band}
                />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard variant="strong" className="p-5 md:p-6">
        <SectionLabel>ai hiring pipeline</SectionLabel>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Resume parsing, interview STT, and RP scoring land in HIRE- and AI- stories. Preview rows
          above show the card rhythm for real queue data.
        </p>
      </GlassCard>
    </ShellPage>
  );
}
