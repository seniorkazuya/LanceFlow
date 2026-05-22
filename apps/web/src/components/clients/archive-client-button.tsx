'use client';

import { Button } from '@lanceflow/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { completeMutation, confirmAction, notifyError } from '@/lib/notify';

type ArchiveClientButtonProps = {
  clientId: string;
  clientName: string;
};

export function ArchiveClientButton({ clientId, clientName }: ArchiveClientButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  function onArchive() {
    confirmAction(`Archive client "${clientName}"?`, async () => {
      setPending(true);
      const res = await fetch(`/api/clients/${clientId}`, { method: 'DELETE' });
      setPending(false);
      if (!res.ok) {
        notifyError('Could not archive client');
        return;
      }
      await completeMutation(router, {
        successMessage: 'Client archived',
        redirectTo: '/clients',
      });
    }, { confirmLabel: 'Archive' });
  }

  return (
    <Button type="button" variant="outline" disabled={pending} onClick={onArchive}>
      {pending ? 'Archiving…' : 'Archive client'}
    </Button>
  );
}
