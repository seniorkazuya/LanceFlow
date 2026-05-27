import { RolePolicy, hasRole } from '@lanceflow/auth';
import {
  HIRING_APPLY_ROLES,
  HIRING_PIPELINE_STAGES,
  getHiringPipelineSnapshot,
  parseHiringPipelineFilters,
} from '@lanceflow/hiring';
import { Button, GlassCard, PageHeader, SectionLabel, StatusBadge } from '@lanceflow/ui';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ShellPage } from '@/components/app/shell-page';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function stageTone(stage: string): 'neutral' | 'warning' | 'success' | 'danger' {
  if (stage === 'rejected') return 'danger';
  if (stage === 'scored') return 'success';
  if (stage === 'assessed' || stage === 'parsed') return 'warning';
  return 'neutral';
}

export default async function HiringPipelinePage({ searchParams }: PageProps) {
  const session = await auth();
  const role = session?.user?.role ?? '';
  if (!hasRole(role, RolePolicy.hiringPipelineRead)) {
    redirect('/dashboard');
  }

  const params = await searchParams;
  const filters = parseHiringPipelineFilters(params);
  const snapshot = await getHiringPipelineSnapshot(filters);
  const totalInPipeline = snapshot.stageCounts.reduce((sum, s) => sum + s.count, 0);

  const query = new URLSearchParams();
  if (filters.status) query.set('status', filters.status);
  if (filters.roleApplied) query.set('roleApplied', filters.roleApplied);
  if (filters.minThs !== undefined) query.set('minThs', String(filters.minThs));
  if (filters.maxRs !== undefined) query.set('maxRs', String(filters.maxRs));
  const filterQuery = query.toString();

  return (
    <ShellPage>
      <PageHeader
        label="hiring"
        title="Hiring pipeline"
        description="Stage counts, THS/RS score distribution, and time-to-hire for Ops and CEO oversight."
        action={
          <Button asChild size="sm" variant="outline">
            <Link href="/hiring/ceo-queue">CEO queue</Link>
          </Button>
        }
      />

      <GlassCard className="p-5 md:p-6">
        <SectionLabel>filters</SectionLabel>
        <form method="get" className="mt-4 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Stage
            <select
              name="status"
              defaultValue={filters.status ?? ''}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">All stages</option>
              {HIRING_PIPELINE_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Role applied
            <select
              name="roleApplied"
              defaultValue={filters.roleApplied ?? ''}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">All roles</option>
              {HIRING_APPLY_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Min THS
            <input
              name="minThs"
              type="number"
              min={0}
              max={100}
              defaultValue={filters.minThs ?? ''}
              className="w-24 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Max RS
            <input
              name="maxRs"
              type="number"
              min={0}
              max={100}
              defaultValue={filters.maxRs ?? ''}
              className="w-24 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </label>
          <Button type="submit" size="sm">
            Apply
          </Button>
          {filterQuery ? (
            <Button asChild size="sm" variant="ghost">
              <Link href="/hiring/pipeline">Clear</Link>
            </Button>
          ) : null}
        </form>
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <GlassCard className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            In pipeline
          </p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{totalInPipeline}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Scored (time-to-hire sample)
          </p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {snapshot.timeToHire.scoredCount}
          </p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Avg days to score
          </p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {snapshot.timeToHire.averageDays !== null
              ? snapshot.timeToHire.averageDays
              : '—'}
          </p>
        </GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="p-5">
          <SectionLabel>pipeline stages</SectionLabel>
          <ul className="mt-4 space-y-2">
            {snapshot.stageCounts.map((row) => (
              <li
                key={row.stage}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <StatusBadge status={stageTone(row.stage)} label={row.stage} />
                <span className="font-mono text-muted-foreground">{row.count}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="p-5">
          <SectionLabel>score distribution (scored)</SectionLabel>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">THS</p>
              <ul className="mt-2 space-y-1 text-sm">
                {snapshot.thsDistribution.map((b) => (
                  <li key={b.label} className="flex justify-between gap-2">
                    <span>{b.label}</span>
                    <span className="font-mono text-muted-foreground">{b.count}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">RS</p>
              <ul className="mt-2 space-y-1 text-sm">
                {snapshot.rsDistribution.map((b) => (
                  <li key={b.label} className="flex justify-between gap-2">
                    <span>{b.label}</span>
                    <span className="font-mono text-muted-foreground">{b.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="overflow-hidden p-0">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold text-foreground">Applications</h2>
          <p className="text-xs text-muted-foreground">
            Latest {snapshot.applications.length} matching filters · API{' '}
            <code className="text-primary/90">/api/hiring/pipeline</code>
          </p>
        </div>
        {snapshot.applications.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">
            No applications match these filters.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {snapshot.applications.map((app) => (
              <li key={app.id} className="px-5 py-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-foreground">{app.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {app.roleApplied} · applied{' '}
                      {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <StatusBadge status={stageTone(app.status)} label={app.status} />
                    {app.technicalScore !== null ? (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-muted-foreground">
                        Tech {app.technicalScore}
                      </span>
                    ) : null}
                    {app.thsScore !== null ? (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-muted-foreground">
                        THS {app.thsScore}
                      </span>
                    ) : null}
                    {app.rsScore !== null ? (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-muted-foreground">
                        RS {app.rsScore}
                      </span>
                    ) : null}
                    {app.daysToScore !== null ? (
                      <span className="text-muted-foreground">{app.daysToScore}d to score</span>
                    ) : null}
                  </div>
                </div>
                {app.hiringRecommendation ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Recommendation: {app.hiringRecommendation}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </ShellPage>
  );
}
