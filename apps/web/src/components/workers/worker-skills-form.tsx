'use client';

import { Button, Input } from '@lanceflow/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { notifyError, notifySuccess } from '@/lib/notify';

type WorkerSkillsFormProps = {
  workerId: string;
  initialTags: string[];
};

export function WorkerSkillsForm({ workerId, initialTags }: WorkerSkillsFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [raw, setRaw] = useState(initialTags.join(', '));

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const skillTags = raw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const res = await fetch(`/api/workers/${workerId}/skills`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillTags }),
    });

    setPending(false);

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { errors?: { message: string }[] };
      const message = data.errors?.[0]?.message ?? 'Save failed';
      setError(message);
      notifyError(message);
      return;
    }

    notifySuccess('Skills updated');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-foreground">Skill tags</span>
        <span className="text-xs text-muted-foreground">
          Comma-separated, lowercase (e.g. react, node, postgres). Used for assignment ranking in OPS-005.
        </span>
        <Input
          name="skillTags"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="react, typescript, aws"
        />
      </label>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? 'Saving…' : 'Save skills'}
      </Button>
    </form>
  );
}
