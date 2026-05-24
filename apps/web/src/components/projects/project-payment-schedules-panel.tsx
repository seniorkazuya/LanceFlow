'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button, Input } from '@lanceflow/ui';

import { completeMutation, notifyError } from '@/lib/notify';

type ScheduleRow = {
  id: string;
  dueDate: string;
  amountCents: number;
  currency: string;
  status: string;
  escalationLevel: number;
};

type Props = {
  projectId: string;
  initialSchedules: ScheduleRow[];
};

export function ProjectPaymentSchedulesPanel({ projectId, initialSchedules }: Props) {
  const router = useRouter();
  const [schedules, setSchedules] = useState(initialSchedules);
  const [dueDate, setDueDate] = useState('');
  const [amountDollars, setAmountDollars] = useState('');
  const [notes, setNotes] = useState('');
  const [pending, setPending] = useState<string | null>(null);

  async function refresh() {
    const res = await fetch(`/api/projects/${projectId}/payment-schedules`);
    if (!res.ok) return;
    const data = (await res.json()) as { items: ScheduleRow[] };
    setSchedules(data.items);
  }

  async function addSchedule() {
    const dollars = Number.parseFloat(amountDollars);
    if (!dueDate || Number.isNaN(dollars) || dollars <= 0) {
      notifyError('Enter a due date and positive amount');
      return;
    }

    setPending('create');
    const res = await fetch(`/api/projects/${projectId}/payment-schedules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dueDate,
        amountCents: Math.round(dollars * 100),
        notes: notes.trim() || null,
      }),
    });
    setPending(null);

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { errors?: { message: string }[] };
      notifyError(data.errors?.[0]?.message ?? 'Could not create payment schedule');
      return;
    }

    setDueDate('');
    setAmountDollars('');
    setNotes('');
    await completeMutation(router, { successMessage: 'Payment schedule added' });
    await refresh();
  }

  async function markPaid(scheduleId: string) {
    setPending(scheduleId);
    const res = await fetch(`/api/payment-schedules/${scheduleId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'paid' }),
    });
    setPending(null);

    if (!res.ok) {
      notifyError('Could not update payment');
      return;
    }

    await completeMutation(router, { successMessage: 'Marked as paid' });
    await refresh();
  }

  return (
    <div className="space-y-4">
      {schedules.length > 0 ? (
        <ul className="space-y-2 text-sm">
          {schedules.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-white/[0.06] px-3 py-2"
            >
              <span>
                <span className="font-medium text-foreground">{row.dueDate}</span>
                <span className="text-muted-foreground">
                  {' '}
                  · {(row.amountCents / 100).toFixed(2)} {row.currency} · L{row.escalationLevel} ·{' '}
                  {row.status}
                </span>
              </span>
              {row.status === 'scheduled' ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={pending !== null}
                  onClick={() => markPaid(row.id)}
                >
                  {pending === row.id ? 'Saving…' : 'Mark paid'}
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No payment due dates yet.</p>
      )}

      <div className="grid gap-2 sm:grid-cols-3">
        <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <Input
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount (USD)"
          value={amountDollars}
          onChange={(e) => setAmountDollars(e.target.value)}
        />
        <Input
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <Button type="button" size="sm" disabled={pending !== null} onClick={addSchedule}>
        {pending === 'create' ? 'Adding…' : 'Add payment due date'}
      </Button>
    </div>
  );
}
