'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@lanceflow/ui';

import { completeMutation, notifyError } from '@/lib/notify';

type Props = {
  clientId: string;
};

type PrescreenResponse = {
  score: number;
  band: string;
  recommendation: string;
  decision?: { outcome: string; explanation: string[] };
};

const RECOMMENDATION_LABEL: Record<string, string> = {
  proceed: 'Proceed — low risk',
  review_required: 'Review required — medium risk',
  do_not_proceed: 'Do not proceed — high risk',
};

export function ClientPrescreenPanel({ clientId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState<PrescreenResponse | null>(null);

  async function runPrescreen() {
    setLoading(true);
    try {
      const res = await fetch(`/api/clients/${clientId}/risk-prescreen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persist: false }),
      });
      const data = (await res.json().catch(() => ({}))) as PrescreenResponse & {
        errors?: { message: string }[];
      };
      if (!res.ok) {
        notifyError(data.errors?.[0]?.message ?? 'Pre-screen failed');
        return;
      }
      setLast(data);
      await completeMutation(router, { successMessage: 'Risk pre-screen complete' });
    } catch {
      notifyError('Pre-screen request failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
      <p className="text-sm font-medium text-foreground">Risk pre-screen (AUTO-006)</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Run before accepting a bid. Stores a RuleDecision and audit trail without changing client
        data unless Ops persists separately.
      </p>
      {last ? (
        <dl className="mt-3 space-y-1 text-sm">
          <div className="flex gap-2">
            <dt className="text-muted-foreground">Score</dt>
            <dd className="font-medium text-foreground">{last.score}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-muted-foreground">Band</dt>
            <dd className="font-medium capitalize text-foreground">{last.band}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-muted-foreground">Recommendation</dt>
            <dd className="font-medium text-foreground">
              {RECOMMENDATION_LABEL[last.recommendation] ?? last.recommendation}
            </dd>
          </div>
        </dl>
      ) : null}
      <Button type="button" size="sm" className="mt-3" disabled={loading} onClick={runPrescreen}>
        {loading ? 'Running…' : 'Run risk pre-screen'}
      </Button>
    </div>
  );
}
