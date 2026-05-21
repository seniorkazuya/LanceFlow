import { GlassCard, PageHeader, SectionLabel, StatusBadge } from '@lanceflow/ui';
import { RolePolicy, hasRole } from '@lanceflow/auth';
import { redirect } from 'next/navigation';

import { ShellPage } from '@/components/app/shell-page';
import { auth } from '@/auth';

const kpiPlaceholders = [
  { label: 'Revenue velocity', status: 'success' as const, detail: 'On track vs. monthly target' },
  { label: 'Exception rate', status: 'warning' as const, detail: '12 items need Ops review' },
  { label: 'Client risk index', status: 'success' as const, detail: 'Within policy thresholds' },
  { label: 'Automation coverage', status: 'success' as const, detail: 'Rules engine v0 — staging' },
] as const;

export default async function ControlPage() {
  const session = await auth();
  const role = session?.user?.role ?? '';
  if (!hasRole(role, RolePolicy.controlCenter)) {
    redirect('/dashboard');
  }

  return (
    <ShellPage>
      <PageHeader
        label="oversight"
        title="Control Center"
        description="CEO and Ops view — KPI aggregates, exceptions, and payout blocks connect in KPI- and AUTO- stories."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {kpiPlaceholders.map((item) => (
          <GlassCard key={item.label} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">{item.label}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
              </div>
              <StatusBadge status={item.status} label="Preview" />
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard variant="strong" className="p-5 md:p-6">
        <SectionLabel>coming soon</SectionLabel>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Full Control Center charts, drill-downs, and formula version badges ship with the Analytics
          epic (KPI-004+). This surface uses the same glass layout as marketing and dashboard.
        </p>
      </GlassCard>
    </ShellPage>
  );
}
