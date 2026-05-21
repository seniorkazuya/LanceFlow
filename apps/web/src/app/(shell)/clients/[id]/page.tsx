import { RolePolicy, hasRole } from '@lanceflow/auth';
import { getClientById } from '@lanceflow/operations';
import { GlassCard, PageHeader, SectionLabel, StatusBadge } from '@lanceflow/ui';
import { notFound, redirect } from 'next/navigation';

import { ShellPage } from '@/components/app/shell-page';
import { ArchiveClientButton } from '@/components/clients/archive-client-button';
import { ClientForm } from '@/components/clients/client-form';
import { auth } from '@/auth';

function riskLevel(score: number): 'success' | 'warning' | 'danger' {
  if (score < 40) return 'success';
  if (score < 70) return 'warning';
  return 'danger';
}

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

      <GlassCard className="p-5 md:p-6">
        <SectionLabel>summary</SectionLabel>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="font-medium capitalize text-foreground">{client.status}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Risk</dt>
            <dd className="mt-1">
              <StatusBadge status={riskLevel(client.riskScore)} label={`${client.riskScore}`} />
            </dd>
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

      {canWrite && client.status === 'active' ? (
        <>
          <GlassCard className="p-6 md:p-8">
            <SectionLabel>edit</SectionLabel>
            <div className="mt-4">
              <ClientForm
                mode="edit"
                clientId={client.id}
                initial={{
                  name: client.name,
                  contactEmail: client.contactEmail ?? '',
                  riskScore: client.riskScore,
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
