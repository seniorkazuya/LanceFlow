'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { Button, Input } from '@lanceflow/ui';

import { completeMutation, notifyError } from '@/lib/notify';

type MilestoneRow = {
  label: string;
  percentPct: string;
  dueDate: string;
  amountCents: string;
};

type SavedMilestone = {
  id: string;
  label: string;
  percentPct: number;
  dueDate: string | null;
};

type Props = {
  projectId: string;
  initialMilestones: SavedMilestone[];
};

function emptyRow(): MilestoneRow {
  return { label: '', percentPct: '', dueDate: '', amountCents: '' };
}

function toRow(m: SavedMilestone): MilestoneRow {
  return {
    label: m.label,
    percentPct: String(m.percentPct),
    dueDate: m.dueDate ?? '',
    amountCents: '',
  };
}

export function ProjectMilestonesPanel({ projectId, initialMilestones }: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialMilestones);
  const [rows, setRows] = useState<MilestoneRow[]>(() =>
    initialMilestones.length > 0
      ? initialMilestones.map(toRow)
      : [
          { label: 'Kickoff', percentPct: '30', dueDate: '', amountCents: '' },
          { label: 'Delivery', percentPct: '50', dueDate: '', amountCents: '' },
          { label: 'Final', percentPct: '20', dueDate: '', amountCents: '' },
        ]
  );
  const [pending, setPending] = useState(false);

  const draftSum = useMemo(
    () =>
      rows.reduce((s, r) => {
        const n = Number.parseInt(r.percentPct, 10);
        return s + (Number.isNaN(n) ? 0 : n);
      }, 0),
    [rows]
  );

  function updateRow(index: number, patch: Partial<MilestoneRow>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow()]);
  }

  function removeRow(index: number) {
    setRows((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  }

  async function save() {
    const milestones = rows.map((r) => {
      const dueDate = r.dueDate.trim() || null;
      const amountRaw = r.amountCents.trim();
      const amountCents = amountRaw ? Number.parseInt(amountRaw, 10) : null;
      return {
        label: r.label.trim(),
        percentPct: Number.parseInt(r.percentPct, 10),
        dueDate,
        amountCents,
      };
    });

    setPending(true);
    const res = await fetch(`/api/projects/${projectId}/milestones`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ milestones }),
    });
    setPending(false);

    const data = (await res.json().catch(() => ({}))) as {
      items?: SavedMilestone[];
      errors?: { message: string }[];
      error?: string;
    };

    if (!res.ok) {
      const detail = data.errors?.map((e) => e.message).join(' · ') ?? data.error ?? 'Save failed';
      notifyError(detail);
      return;
    }

    setSaved(data.items ?? []);
    await completeMutation(router, { successMessage: 'Payment milestones saved' });
  }

  return (
    <div className="space-y-4">
      {saved.length > 0 ? (
        <p className="text-sm text-muted-foreground">
          Saved:{' '}
          {saved
            .map((m) => {
              const due = m.dueDate ? ` · due ${m.dueDate}` : '';
              return `${m.label} (${m.percentPct}%)${due}`;
            })
            .join(' · ')}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Define milestone labels and percentages (sum 100%). Optional due date + amount sync
          payment reminders (PAY-003 / AUTO-005).
        </p>
      )}

      <ul className="space-y-2">
        {rows.map((row, index) => (
          <li key={index} className="flex flex-wrap items-end gap-2">
            <label className="min-w-[120px] flex-1 text-sm">
              <span className="text-muted-foreground">Label</span>
              <Input
                className="mt-1"
                value={row.label}
                onChange={(e) => updateRow(index, { label: e.target.value })}
              />
            </label>
            <label className="w-16 text-sm">
              <span className="text-muted-foreground">%</span>
              <Input
                className="mt-1"
                type="number"
                min={1}
                max={100}
                value={row.percentPct}
                onChange={(e) => updateRow(index, { percentPct: e.target.value })}
              />
            </label>
            <label className="w-32 text-sm">
              <span className="text-muted-foreground">Due</span>
              <Input
                className="mt-1"
                type="date"
                value={row.dueDate}
                onChange={(e) => updateRow(index, { dueDate: e.target.value })}
              />
            </label>
            <label className="w-28 text-sm">
              <span className="text-muted-foreground">Amount ¢</span>
              <Input
                className="mt-1"
                type="number"
                min={1}
                value={row.amountCents}
                onChange={(e) => updateRow(index, { amountCents: e.target.value })}
              />
            </label>
            <Button type="button" variant="secondary" size="sm" onClick={() => removeRow(index)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="secondary" size="sm" onClick={addRow}>
          Add milestone
        </Button>
        <span
          className={`text-sm ${draftSum === 100 ? 'text-primary' : 'text-destructive'}`}
        >
          Total: {draftSum}% {draftSum === 100 ? '✓' : '(must be 100%)'}
        </span>
        <Button type="button" size="sm" disabled={pending} onClick={() => void save()}>
          {pending ? 'Saving…' : 'Save milestones'}
        </Button>
      </div>
    </div>
  );
}
