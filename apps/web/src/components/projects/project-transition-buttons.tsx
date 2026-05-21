'use client';

import { Button } from '@lanceflow/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type ProjectTransitionButtonsProps = {
  projectId: string;
  currentStatus: string;
  allowedNext: readonly string[];
};

export function ProjectTransitionButtons({
  projectId,
  currentStatus,
  allowedNext,
}: ProjectTransitionButtonsProps) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function transition(to: string) {
    setError(null);
    setPending(to);
    const res = await fetch(`/api/projects/${projectId}/transition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: to }),
    });
    setPending(null);
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { errors?: { message: string }[] };
      setError(data.errors?.[0]?.message ?? 'Transition failed');
      return;
    }
    router.refresh();
  }

  if (allowedNext.length === 0) {
    return <p className="text-sm text-muted-foreground">No further transitions from {currentStatus}.</p>;
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {allowedNext.map((status) => (
          <Button
            key={status}
            type="button"
            variant="outline"
            size="sm"
            disabled={pending !== null}
            onClick={() => transition(status)}
          >
            {pending === status ? '…' : status.replace('_', ' ')}
          </Button>
        ))}
      </div>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
