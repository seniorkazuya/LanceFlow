'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Button, Input, StatusBadge } from '@lanceflow/ui';

import { completeMutation, notifyError } from '@/lib/notify';

type GatingStatus = {
  blocked: boolean;
  reason: string | null;
  escrowHeld: boolean;
  overrideActive: boolean;
  overduePaymentCount: number;
  message: string;
};

type Props = {
  projectId: string;
};

export function ProjectEscrowPanel({ projectId }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<GatingStatus | null>(null);
  const [reason, setReason] = useState('');
  const [pending, setPending] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/projects/${projectId}/work-gating`);
    if (!res.ok) return;
    const json = (await res.json()) as GatingStatus;
    setStatus(json);
  }, [projectId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function act(action: 'release' | 'clear_override' | 'hold' | 'unhold') {
    if ((action === 'release' || action === 'hold') && !reason.trim()) {
      notifyError('Enter a reason for this action');
      return;
    }
    setPending(true);
    const res = await fetch(`/api/projects/${projectId}/escrow-override`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reason: reason.trim() || undefined }),
    });
    setPending(false);
    const json = (await res.json().catch(() => ({}))) as {
      gating?: GatingStatus;
      errors?: { message: string }[];
    };
    if (!res.ok) {
      notifyError(json.errors?.map((e) => e.message).join(' · ') ?? 'Escrow action failed');
      return;
    }
    if (json.gating) setStatus(json.gating);
    setReason('');
    await completeMutation(router, { successMessage: 'Escrow status updated' });
  }

  if (!status) {
    return <p className="text-sm text-muted-foreground">Loading work gating…</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge
          status={status.blocked ? 'danger' : 'success'}
          label={status.blocked ? 'Work blocked' : 'Work allowed'}
        />
        {status.escrowHeld ? <StatusBadge status="warning" label="Escrow hold" /> : null}
        {status.overrideActive ? <StatusBadge status="success" label="Override active" /> : null}
        {status.overduePaymentCount > 0 ? (
          <span className="text-sm text-muted-foreground">
            {status.overduePaymentCount} overdue payment(s)
          </span>
        ) : null}
      </div>
      <p className="text-sm text-muted-foreground">{status.message}</p>

      <label className="block text-sm">
        <span className="text-muted-foreground">Ops note (required for release / hold)</span>
        <Input className="mt-1" value={reason} onChange={(e) => setReason(e.target.value)} />
      </label>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={pending}
          onClick={() => void act('release')}
        >
          Release override
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={pending}
          onClick={() => void act('clear_override')}
        >
          Clear override
        </Button>
        <Button type="button" size="sm" disabled={pending} onClick={() => void act('hold')}>
          Manual hold
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={pending}
          onClick={() => void act('unhold')}
        >
          Clear hold
        </Button>
      </div>
    </div>
  );
}
