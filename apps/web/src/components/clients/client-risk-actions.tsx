'use client';

import { Button, Input } from '@lanceflow/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { notifyError, notifySuccess } from '@/lib/notify';

type ClientRiskActionsProps = {
  clientId: string;
};

export function ClientRiskActions({ clientId }: ClientRiskActionsProps) {
  const router = useRouter();
  const [pending, setPending] = useState<'evaluate' | 'override' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [riskScore, setRiskScore] = useState(50);
  const [reason, setReason] = useState('');

  async function onEvaluate() {
    setError(null);
    setPending('evaluate');
    const res = await fetch(`/api/clients/${clientId}/risk-evaluate`, { method: 'POST' });
    setPending(null);
    if (!res.ok) {
      setError('Evaluation failed');
      notifyError('Evaluation failed');
      return;
    }
    notifySuccess('Risk score evaluated');
    router.refresh();
  }

  async function onOverride(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending('override');
    const res = await fetch(`/api/clients/${clientId}/risk-override`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ riskScore, reason }),
    });
    setPending(null);
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { errors?: { message: string }[] };
      const message = data.errors?.[0]?.message ?? 'Override failed';
      setError(message);
      notifyError(message);
      return;
    }
    setReason('');
    notifySuccess('Risk override applied');
    router.refresh();
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" disabled={pending !== null} onClick={onEvaluate}>
          {pending === 'evaluate' ? 'Evaluating…' : 'Run v0 evaluation'}
        </Button>
      </div>
      <form onSubmit={onOverride} className="grid gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
        <p className="text-sm font-medium text-foreground">Manual override (audited)</p>
        <label className="grid gap-1.5 text-sm">
          <span className="text-muted-foreground">Risk score (0–100)</span>
          <Input
            type="number"
            min={0}
            max={100}
            value={riskScore}
            onChange={(e) => setRiskScore(Number(e.target.value))}
            required
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="text-muted-foreground">Reason (required)</span>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Payment history review"
            required
          />
        </label>
        <Button type="submit" disabled={pending !== null}>
          {pending === 'override' ? 'Saving…' : 'Apply override'}
        </Button>
      </form>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
