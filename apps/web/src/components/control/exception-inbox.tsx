'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Button, GlassCard, SectionLabel, StatusBadge } from '@lanceflow/ui';

import { entityHref } from '@/lib/exceptions-api';
import { completeMutation, notifyError } from '@/lib/notify';

type ExceptionItem = {
  id: string;
  severity: 'danger' | 'warning' | 'success';
  category: string;
  title: string;
  summary: string;
  entityType: string;
  entityId: string;
  status: string;
};

type InboxResponse = {
  summary: { open: number; danger: number; warning: number; success: number };
  items: ExceptionItem[];
};

const SEVERITY_LABEL: Record<ExceptionItem['severity'], string> = {
  danger: 'Critical',
  warning: 'Review',
  success: 'Info',
};

const CATEGORY_LABEL: Record<string, string> = {
  project_approval: 'Approval',
  rule_decision: 'Rule',
  payment: 'Payment',
  client_risk: 'Client risk',
  assignment: 'Assignment',
};

export function ExceptionInbox() {
  const router = useRouter();
  const [data, setData] = useState<InboxResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const load = useCallback(async (sync = false) => {
    setLoading(true);
    try {
      const url = sync ? '/api/control/exceptions?sync=true' : '/api/control/exceptions';
      const res = await fetch(url);
      const json = (await res.json()) as InboxResponse & { error?: string };
      if (!res.ok) {
        notifyError(json.error ?? 'Failed to load exceptions');
        return;
      }
      setData(json);
    } catch {
      notifyError('Failed to load exceptions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function refresh() {
    setSyncing(true);
    try {
      const res = await fetch('/api/control/exceptions', { method: 'POST' });
      const json = (await res.json()) as InboxResponse & { error?: string };
      if (!res.ok) {
        notifyError(json.error ?? 'Sync failed');
        return;
      }
      setData(json);
      await completeMutation(router, { successMessage: 'Exception inbox refreshed' });
    } catch {
      notifyError('Sync failed');
    } finally {
      setSyncing(false);
    }
  }

  async function acknowledge(id: string) {
    try {
      const res = await fetch(`/api/control/exceptions/${id}/acknowledge`, { method: 'POST' });
      if (!res.ok) {
        notifyError('Acknowledge failed');
        return;
      }
      await load(true);
      await completeMutation(router, { successMessage: 'Exception acknowledged' });
    } catch {
      notifyError('Acknowledge failed');
    }
  }

  const summary = data?.summary;
  const items = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <GlassCard className="px-4 py-3">
            <p className="text-xs text-muted-foreground">Open</p>
            <p className="text-lg font-semibold text-foreground">{summary?.open ?? '—'}</p>
          </GlassCard>
          <GlassCard className="px-4 py-3">
            <p className="text-xs text-muted-foreground">Critical</p>
            <p className="text-lg font-semibold text-destructive">{summary?.danger ?? '—'}</p>
          </GlassCard>
          <GlassCard className="px-4 py-3">
            <p className="text-xs text-muted-foreground">Review</p>
            <p className="text-lg font-semibold text-amber-600">{summary?.warning ?? '—'}</p>
          </GlassCard>
        </div>
        <Button type="button" variant="secondary" disabled={syncing || loading} onClick={() => void refresh()}>
          {syncing ? 'Syncing…' : 'Refresh inbox'}
        </Button>
      </div>

      <GlassCard variant="strong" className="p-5 md:p-6">
        <SectionLabel>exception inbox</SectionLabel>
        <p className="mt-2 text-sm text-muted-foreground">
          CEO and Ops review automated rule outcomes, stalled approvals, payment escalations, and
          elevated client risk. Acknowledged items stay visible until the underlying signal clears.
        </p>

        {loading && !data ? (
          <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
        ) : items.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">No open exceptions — automation is green.</p>
        ) : (
          <ul className="mt-6 divide-y divide-border">
            {items.map((item) => {
              const href = entityHref(item.entityType, item.entityId);
              return (
                <li key={item.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge
                        status={item.severity}
                        label={SEVERITY_LABEL[item.severity]}
                      />
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        {CATEGORY_LABEL[item.category] ?? item.category}
                      </span>
                      {item.status === 'acknowledged' ? (
                        <span className="text-xs text-muted-foreground">Acknowledged</span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm font-medium text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p>
                    {href ? (
                      <Link href={href} className="mt-2 inline-block text-sm text-primary hover:underline">
                        View {item.entityType}
                      </Link>
                    ) : null}
                  </div>
                  {item.status === 'open' ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                      onClick={() => void acknowledge(item.id)}
                    >
                      Acknowledge
                    </Button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </GlassCard>
    </div>
  );
}
