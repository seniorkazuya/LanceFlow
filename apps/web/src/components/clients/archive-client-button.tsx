'use client';

import { Button } from '@lanceflow/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type ArchiveClientButtonProps = {
  clientId: string;
  clientName: string;
};

export function ArchiveClientButton({ clientId, clientName }: ArchiveClientButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onArchive() {
    if (!confirm(`Archive client "${clientName}"?`)) return;
    setPending(true);
    const res = await fetch(`/api/clients/${clientId}`, { method: 'DELETE' });
    setPending(false);
    if (res.ok) {
      router.push('/clients');
      router.refresh();
    }
  }

  return (
    <Button type="button" variant="outline" disabled={pending} onClick={onArchive}>
      {pending ? 'Archiving…' : 'Archive client'}
    </Button>
  );
}
