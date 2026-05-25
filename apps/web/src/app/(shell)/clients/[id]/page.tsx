import { RolePolicy, hasRole } from '@lanceflow/auth';
import { getClientById } from '@lanceflow/operations';
import { GlassCard, PageHeader, SectionLabel } from '@lanceflow/ui';
import { notFound, redirect } from 'next/navigation';

import { ShellPage } from '@/components/app/shell-page';
import { ArchiveClientButton } from '@/components/clients/archive-client-button';
import { ClientForm } from '@/components/clients/client-form';
import { ClientPrescreenPanel } from '@/components/clients/client-prescreen-panel';
import { ClientRiskActions } from '@/components/clients/client-risk-actions';
import { RiskPanel } from '@/components/clients/risk-panel';
import { auth } from '@/auth';

type PageProps = { params: Promise<{ id: string }> };

export default async function ClientDetailPage({ params }: PageProps) {
  const session = await auth();
  const role = session?.user?.role ?? '';
  if (!hasRole(role, RolePolicy.clientsRead)) {
    redirect('/dashboard');
  }

  const { id } = await params;
  const client = await getClientById(id);
  if (!client) {
    notFound();
  }

  const canWrite = hasRole(role, RolePolicy.clientsWrite);
  const canPrescreen = hasRole(role, RolePolicy.clientRiskPrescreen);

  return (
    <ShellPage>
      <PageHeader
        label="client"
        title={client.name}
        description={
          canWrite
            ? 'Edit details below or archive when the relationship ends.'
            : 'Read-only view — Bidders can reference client context for proposals.'
        }
      />

      <RiskPanel client={client} />

      <GlassCard className="p-5 md:p-6">
        <SectionLabel>summary</SectionLabel>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="font-medium capitalize text-foreground">{client.status}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Contact</dt>
            <dd className="font-medium text-foreground">{client.contactEmail ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Updated</dt>
            <dd className="font-medium text-foreground">{client.updatedAt.toLocaleString()}</dd>
          </div>
        </dl>
        {client.notes ? (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{client.notes}</p>
        ) : null}
      </GlassCard>

      {canPrescreen && !canWrite && client.status === 'active' ? (
        <GlassCard className="p-6 md:p-8">
          <SectionLabel>bid readiness</SectionLabel>
          <ClientPrescreenPanel clientId={client.id} />
        </GlassCard>
      ) : null}

      {canWrite && client.status === 'active' ? (
        <>
          <GlassCard className="p-6 md:p-8">
            <SectionLabel>risk controls</SectionLabel>
            <div className="mt-4">
              <ClientRiskActions clientId={client.id} />
            </div>
          </GlassCard>
          <GlassCard className="p-6 md:p-8">
            <SectionLabel>edit profile</SectionLabel>
            <div className="mt-4">
              <ClientForm
                mode="edit"
                clientId={client.id}
                initial={{
                  name: client.name,
                  contactEmail: client.contactEmail ?? '',
                  notes: client.notes ?? '',
                }}
              />
            </div>
          </GlassCard>
          <ArchiveClientButton clientId={client.id} clientName={client.name} />
        </>
      ) : null}
    </ShellPage>
  );
}
