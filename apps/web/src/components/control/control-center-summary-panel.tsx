'use client';

import type { KpiSignalThresholdsConfig } from '@lanceflow/analytics';
import { classifyKpiScore } from '@lanceflow/analytics';
import { useCallback, useEffect, useState } from 'react';

import { GlassCard, StatusBadge } from '@lanceflow/ui';

type SummaryResponse = {
  period: { key: string; start: string; end: string };
  exceptions: { open: number; danger: number; warning: number; success: number };
  kpi: {
    periodKey: string;
    recordCount: number;
    byRole: { role: string; count: number; avgScore: number }[];
  };
  operations: {
    projectsPendingApproval: number;
    projectsActive: number;
    overduePayments: number;
    highRiskClients: number;
  };
  thresholds: KpiSignalThresholdsConfig;
};

function exceptionStatus(exceptions: SummaryResponse['exceptions']): 'danger' | 'warning' | 'success' {
  if (exceptions.danger > 0) return 'danger';
  if (exceptions.warning > 0 || exceptions.open > 0) return 'warning';
  return 'success';
}

const ROLE_LABEL: Record<string, string> = {
  engineer: 'Engineers',
  bidder: 'Bidders',
  caller: 'Callers',
};

export function ControlCenterSummaryPanel() {
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/control-center/summary');
      const json = (await res.json()) as SummaryResponse & { error?: string };
      if (!res.ok) {
        setError(json.error ?? 'Failed to load summary');
        return;
      }
      setData(json);
    } catch {
      setError('Failed to load summary');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !data) {
    return <p className="text-sm text-muted-foreground">Loading company signals…</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (!data) return null;

  const engineerKpi = data.kpi.byRole.find((r) => r.role === 'engineer');
  const avgEngineer = engineerKpi?.avgScore ?? null;
  const thresholds = data.thresholds;
  const highRiskMin = thresholds.clientRisk.yellowMax + 1;

  const cards = [
    {
      label: 'Open exceptions',
      value: String(data.exceptions.open),
      detail: `${data.exceptions.danger} critical · ${data.exceptions.warning} review`,
      status: exceptionStatus(data.exceptions),
      badge: data.exceptions.open === 0 ? 'Clear' : 'Attention',
    },
    {
      label: 'Engineer KPI (week)',
      value: avgEngineer !== null ? String(avgEngineer) : '—',
      detail: data.kpi.recordCount > 0 ? `${data.kpi.recordCount} records · ${data.period.key}` : 'Run KPI rollup job',
      status:
        avgEngineer !== null ? classifyKpiScore(avgEngineer, thresholds.kpiScore) : ('warning' as const),
      badge: 'Weekly',
    },
    {
      label: 'Pending approval',
      value: String(data.operations.projectsPendingApproval),
      detail: 'Projects awaiting leadership',
      status: data.operations.projectsPendingApproval > 0 ? ('warning' as const) : ('success' as const),
      badge: 'Pipeline',
    },
    {
      label: 'Overdue payments',
      value: String(data.operations.overduePayments),
      detail: 'Scheduled or escalated',
      status: data.operations.overduePayments > 0 ? ('danger' as const) : ('success' as const),
      badge: 'Cash',
    },
    {
      label: 'High-risk clients',
      value: String(data.operations.highRiskClients),
      detail: `Risk score ≥ ${highRiskMin}`,
      status: data.operations.highRiskClients > 0 ? ('warning' as const) : ('success' as const),
      badge: 'Risk',
    },
    {
      label: 'Active projects',
      value: String(data.operations.projectsActive),
      detail: 'Currently in delivery',
      status: 'success' as const,
      badge: 'Ops',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Period {data.period.key} ({data.period.start} → {data.period.end})
        </p>
        <button
          type="button"
          className="text-sm text-primary hover:underline"
          onClick={() => void load()}
        >
          Refresh signals
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <GlassCard key={card.label} className="p-5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{card.label}</p>
              <StatusBadge status={card.status} label={card.badge} />
            </div>
            <p className="mt-2 text-2xl font-semibold text-foreground">{card.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{card.detail}</p>
          </GlassCard>
        ))}
      </div>

      {data.kpi.byRole.length > 0 ? (
        <GlassCard className="p-5">
          <p className="text-sm font-medium text-foreground">Role KPI averages</p>
          <ul className="mt-3 flex flex-wrap gap-4 text-sm">
            {data.kpi.byRole.map((row) => (
              <li key={row.role} className="flex items-center gap-2">
                <StatusBadge
                  status={classifyKpiScore(row.avgScore, thresholds.kpiScore)}
                  label={ROLE_LABEL[row.role] ?? row.role}
                />
                <span className="font-medium text-foreground">{row.avgScore}</span>
                <span className="text-muted-foreground">({row.count})</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      ) : null}
    </div>
  );
}
