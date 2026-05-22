'use client';

import { Button, Input } from '@lanceflow/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { completeMutation, notifyError } from '@/lib/notify';

type AssignmentOption = {
  projectId: string;
  projectTitle: string;
  clientName: string;
};

type DailyReportFormProps = {
  assignments: AssignmentOption[];
};

export function DailyReportForm({ assignments }: DailyReportFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectId, setProjectId] = useState(assignments[0]?.projectId ?? '');
  const [hours, setHours] = useState(8);
  const [progressPct, setProgressPct] = useState(50);
  const [issues, setIssues] = useState('');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const res = await fetch('/api/daily-reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        hours,
        progressPct,
        issues: issues.trim() || null,
      }),
    });

    setPending(false);

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { errors?: { message: string }[] };
      const message = data.errors?.[0]?.message ?? 'Submit failed';
      setError(message);
      notifyError(message);
      return;
    }

    await completeMutation(router, { successMessage: 'Daily report submitted' });
  }

  if (assignments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No active project assignments. Ask Ops to assign you before submitting a daily report.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Project</span>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="h-11 rounded-xl border border-border bg-card px-4 text-sm"
          required
        >
          {assignments.map((a) => (
            <option key={a.projectId} value={a.projectId}>
              {a.projectTitle} ({a.clientName})
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Hours worked</span>
        <Input
          type="number"
          min={0}
          max={24}
          step={0.5}
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          required
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Progress %</span>
        <Input
          type="number"
          min={0}
          max={100}
          value={progressPct}
          onChange={(e) => setProgressPct(Number(e.target.value))}
          required
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Issues / blockers</span>
        <textarea
          rows={3}
          value={issues}
          onChange={(e) => setIssues(e.target.value)}
          placeholder="Optional — what slowed you down?"
          className="rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        />
      </label>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? 'Submitting…' : 'Submit today’s report'}
      </Button>
    </form>
  );
}
