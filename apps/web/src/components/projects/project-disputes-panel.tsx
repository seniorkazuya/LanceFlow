'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { DISPUTE_CEO_ESCALATION_CENTS } from '@lanceflow/operations';
import { Button, Input, StatusBadge } from '@lanceflow/ui';

import { completeMutation, notifyError } from '@/lib/notify';

type DisputeItem = {
  id: string;
  title: string;
  amountCents: number;
  currency: string;
  status: string;
  description: string | null;
};

const STATUS_LABEL: Record<string, string> = {
  open: 'Open',
  investigating: 'Investigating',
  escalated: 'Escalated',
  resolved: 'Resolved',
};

const NEXT_ACTION: Record<string, { status: string; label: string } | null> = {
  open: { status: 'investigating', label: 'Start investigation' },
  investigating: { status: 'escalated', label: 'Escalate to CEO' },
  escalated: null,
  resolved: null,
};

type Props = {
  projectId: string;
};

export function ProjectDisputesPanel({ projectId }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<DisputeItem[]>([]);
  const [title, setTitle] = useState('');
  const [amountCents, setAmountCents] = useState('');
  const [description, setDescription] = useState('');
  const [pending, setPending] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/projects/${projectId}/disputes`);
    if (!res.ok) return;
    const json = (await res.json()) as { items?: DisputeItem[] };
    setItems(json.items ?? []);
  }, [projectId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function createDispute() {
    const cents = Number.parseInt(amountCents, 10);
    if (!title.trim() || !Number.isInteger(cents) || cents <= 0) {
      notifyError('Title and a positive amount (cents) are required');
      return;
    }
    setPending(true);
    const res = await fetch(`/api/projects/${projectId}/disputes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim() || null,
        amountCents: cents,
      }),
    });
    setPending(false);
    const json = (await res.json().catch(() => ({}))) as {
      errors?: { message: string }[];
    };
    if (!res.ok) {
      notifyError(json.errors?.map((e) => e.message).join(' · ') ?? 'Create failed');
      return;
    }
    setTitle('');
    setAmountCents('');
    setDescription('');
    await load();
    await completeMutation(router, { successMessage: 'Dispute opened' });
  }

  async function transition(disputeId: string, status: string) {
    let resolutionNote: string | undefined;
    if (status === 'resolved') {
      const note = window.prompt('Resolution note (required)');
      if (!note?.trim()) return;
      resolutionNote = note.trim();
    }
    setPending(true);
    const res = await fetch(`/api/disputes/${disputeId}/transition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, resolutionNote }),
    });
    setPending(false);
    const json = (await res.json().catch(() => ({}))) as { errors?: { message: string }[] };
    if (!res.ok) {
      notifyError(json.errors?.map((e) => e.message).join(' · ') ?? 'Transition failed');
      return;
    }
    await load();
    await completeMutation(router, { successMessage: 'Dispute updated' });
  }

  const ceoThreshold = (DISPUTE_CEO_ESCALATION_CENTS / 100).toFixed(0);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Follow the{' '}
        <Link href="/sops" className="text-primary underline">
          dispute SOP
        </Link>
        . Escalating disputes ≥ ${ceoThreshold} opens a CEO leadership exception.
      </p>

      <div className="flex flex-wrap gap-2">
        <Input
          className="min-w-[140px] flex-1"
          placeholder="Dispute title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          className="w-28"
          type="number"
          placeholder="Amount ¢"
          value={amountCents}
          onChange={(e) => setAmountCents(e.target.value)}
        />
        <Button type="button" size="sm" disabled={pending} onClick={() => void createDispute()}>
          Open dispute
        </Button>
      </div>
      <Input
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <ul className="space-y-3">
        {items.length === 0 ? (
          <li className="text-sm text-muted-foreground">No disputes on this project.</li>
        ) : (
          items.map((d) => {
            const next = NEXT_ACTION[d.status];
            const highValue = d.amountCents >= DISPUTE_CEO_ESCALATION_CENTS;
            return (
              <li key={d.id} className="rounded-lg border border-border/60 p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{d.title}</span>
                  <StatusBadge status={d.status === 'resolved' ? 'success' : 'warning'} label={STATUS_LABEL[d.status] ?? d.status} />
                  {highValue ? <StatusBadge status="danger" label="High value" /> : null}
                </div>
                <p className="mt-1 text-muted-foreground">
                  {(d.amountCents / 100).toFixed(2)} {d.currency}
                  {d.description ? ` · ${d.description}` : ''}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {next ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      disabled={pending}
                      onClick={() => void transition(d.id, next.status)}
                    >
                      {next.label}
                    </Button>
                  ) : null}
                  {d.status !== 'resolved' ? (
                    <Button
                      type="button"
                      size="sm"
                      disabled={pending}
                      onClick={() => void transition(d.id, 'resolved')}
                    >
                      Resolve
                    </Button>
                  ) : null}
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
