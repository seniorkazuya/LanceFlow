import { RolePolicy, hasRole } from '@lanceflow/auth';
import { GlassCard, PageHeader } from '@lanceflow/ui';
import { redirect } from 'next/navigation';

import { ShellPage } from '@/components/app/shell-page';
import { ClientForm } from '@/components/clients/client-form';
import { auth } from '@/auth';

export default async function NewClientPage() {
  const session = await auth();
  const role = session?.user?.role ?? '';
  if (!hasRole(role, RolePolicy.clientsWrite)) {
    redirect('/clients');
  }

  return (
    <ShellPage>
      <PageHeader label="operations" title="New client" description="Create a client record for ops workflows." />
      <GlassCard className="p-6 md:p-8">
        <ClientForm mode="create" />
      </GlassCard>
    </ShellPage>
  );
}
