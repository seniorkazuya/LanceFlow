'use client';

import { Button, Input } from '@lanceflow/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { completeMutation, notifyError } from '@/lib/notify';

export type ClientFormValues = {
  name: string;
  contactEmail: string;
  notes: string;
};

type ClientFormProps = {
  mode: 'create' | 'edit';
  clientId?: string;
  initial?: Partial<ClientFormValues>;
};

export function ClientForm({ mode, clientId, initial }: ClientFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<ClientFormValues>({
    name: initial?.name ?? '',
    contactEmail: initial?.contactEmail ?? '',
    notes: initial?.notes ?? '',
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const payload = {
      name: values.name,
      contactEmail: values.contactEmail || null,
      notes: values.notes || null,
    };

    const url = mode === 'create' ? '/api/clients' : `/api/clients/${clientId}`;
    const method = mode === 'create' ? 'POST' : 'PATCH';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setPending(false);

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { errors?: { message: string }[] };
      const message = data.errors?.[0]?.message ?? 'Save failed';
      setError(message);
      notifyError(message);
      return;
    }

    const data = (await res.json()) as { client: { id: string } };
    await completeMutation(router, {
      successMessage: mode === 'create' ? 'Client created' : 'Client updated',
      redirectTo: `/clients/${data.client.id}`,
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-foreground">Name</span>
        <Input
          name="name"
          required
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-foreground">Contact email</span>
        <Input
          name="contactEmail"
          type="email"
          value={values.contactEmail}
          onChange={(e) => setValues((v) => ({ ...v, contactEmail: e.target.value }))}
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-foreground">Notes</span>
        <textarea
          name="notes"
          rows={3}
          value={values.notes}
          onChange={(e) => setValues((v) => ({ ...v, notes: e.target.value }))}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring/50"
        />
      </label>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : mode === 'create' ? 'Create client' : 'Save changes'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
