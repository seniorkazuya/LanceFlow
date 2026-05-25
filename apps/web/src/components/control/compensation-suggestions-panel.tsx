'use client';

import { useCallback, useEffect, useState } from 'react';

import { Button, GlassCard, SectionLabel, StatusBadge } from '@lanceflow/ui';

import { formatPercentBps } from '@/lib/compensation-suggestions-api';
import { notifyError } from '@/lib/notify';

type SuggestionItem = {
  id: string;
  userDisplayName: string;
  userRole: string;
  periodKey: string;
  kind: 'bonus' | 'penalty';
  percentBps: number;
  kpiScore: number;
  status: string;
};

const KIND_LABEL: Record<SuggestionItem['kind'], string> = {
  bonus: 'Bonus',
  penalty: 'Penalty',
};

const ROLE_LABEL: Record<string, string> = {
  engineer: 'Engineer',
  bidder: 'Bidder',
  caller: 'Caller',
};

export function CompensationSuggestionsPanel() {
  const [items, setItems] = useState<SuggestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/control-center/compensation-suggestions?status=pending');
      const json = (await res.json()) as { items?: SuggestionItem[]; error?: string };
      if (!res.ok) {
        notifyError(json.error ?? 'Failed to load suggestions');
        return;
      }
      setItems(json.items ?? []);
    } catch {
      notifyError('Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function generate() {
    setGenerating(true);
    try {
      const res = await fetch('/api/control-center/compensation-suggestions', { method: 'POST' });
      const json = (await res.json()) as { items?: SuggestionItem[]; error?: string };
      if (!res.ok) {
        notifyError(json.error ?? 'Generate failed');
        return;
      }
      setItems(json.items ?? []);
    } catch {
      notifyError('Generate failed');
    } finally {
      setGenerating(false);
    }
  }

  async function review(id: string, action: 'approve' | 'reject') {
    setReviewingId(id);
    try {
      const res = await fetch(`/api/control-center/compensation-suggestions/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const json = (await res.json()) as { error?: string; errors?: { message: string }[] };
      if (!res.ok) {
        const detail = json.errors?.map((e) => e.message).join(' · ') ?? json.error ?? 'Review failed';
        notifyError(detail);
        return;
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      notifyError('Review failed');
    } finally {
      setReviewingId(null);
    }
  }

  return (
    <GlassCard className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <SectionLabel>Bonus / penalty</SectionLabel>
          <p className="mt-1 text-sm text-muted-foreground">
            System suggestions from weekly KPI (KPI-006). Ops approves — not payroll.
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" size="sm" disabled={loading} onClick={() => void load()}>
            Refresh
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={generating}
            onClick={() => void generate()}
          >
            {generating ? 'Generating…' : 'Generate from KPI'}
          </Button>
        </div>
      </div>

      {loading && items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Loading suggestions…</p>
      ) : null}

      {!loading && items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No pending suggestions. Run KPI rollup, then generate, or wait for the nightly job.
        </p>
      ) : null}

      {items.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/40 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    status={item.kind === 'bonus' ? 'success' : 'danger'}
                    label={KIND_LABEL[item.kind]}
                  />
                  <span className="font-medium text-foreground">{item.userDisplayName}</span>
                  <span className="text-sm text-muted-foreground">
                    {ROLE_LABEL[item.userRole] ?? item.userRole} · {item.periodKey}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  KPI {item.kpiScore} → {formatPercentBps(item.percentBps)}{' '}
                  {item.kind === 'bonus' ? 'bonus' : 'penalty'}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={reviewingId === item.id}
                  onClick={() => void review(item.id, 'reject')}
                >
                  Reject
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={reviewingId === item.id}
                  onClick={() => void review(item.id, 'approve')}
                >
                  Approve
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </GlassCard>
  );
}
