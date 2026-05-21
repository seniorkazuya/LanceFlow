'use client';

import { Button, Input } from '@lanceflow/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type ProjectFormProps = {
  clients: { id: string; name: string }[];
};

export function ProjectForm({ clients }: ProjectFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState(clients[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [scopeClarityPct, setScopeClarityPct] = useState(80);
  const [profitMarginPct, setProfitMarginPct] = useState(25);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, title, scopeClarityPct, profitMarginPct }),
    });

    setPending(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { errors?: { message: string }[] };
      setError(data.errors?.[0]?.message ?? 'Create failed');
      return;
    }

    const data = (await res.json()) as { project: { id: string } };
    router.push(`/projects/${data.project.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Client</span>
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm"
          required
        >
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Title</span>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Scope clarity %</span>
        <Input
          type="number"
          min={0}
          max={100}
          value={scopeClarityPct}
          onChange={(e) => setScopeClarityPct(Number(e.target.value))}
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Profit margin %</span>
        <Input
          type="number"
          min={0}
          max={100}
          value={profitMarginPct}
          onChange={(e) => setProfitMarginPct(Number(e.target.value))}
        />
      </label>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={pending || clients.length === 0}>
        {pending ? 'Creating…' : 'Create project'}
      </Button>
    </form>
  );
}
