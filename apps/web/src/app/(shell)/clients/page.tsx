import { RolePolicy, hasRole } from '@lanceflow/auth';
import { listClients, riskBand, riskBandLabel } from '@lanceflow/operations';
import { Button, GlassCard, PageHeader, StatusBadge } from '@lanceflow/ui';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ShellPage } from '@/components/app/shell-page';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

function riskLevel(score: number): 'success' | 'warning' | 'danger' {
  if (score < 40) return 'success';
  if (score < 70) return 'warning';
  return 'danger';
}

export default async function ClientsPage() {
  const session = await auth();
  const role = session?.user?.role ?? '';
  if (!hasRole(role, RolePolicy.clientsRead)) {
    redirect('/dashboard');
  }

  const canWrite = hasRole(role, RolePolicy.clientsWrite);
  const clients = await listClients(false);

  return (
    <ShellPage>
      <PageHeader
        label="operations"
        title="Clients"
        description="Manage client records — Ops can create and edit; Bidders have read-only access."
        action={
          canWrite ? (
            <Button asChild size="sm">
              <Link href="/clients/new">New client</Link>
            </Button>
          ) : null
        }
      />

      <GlassCard className="overflow-hidden p-0">
        {clients.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">
            No active clients yet.
            {canWrite ? (
              <>
                {' '}
                <Link href="/clients/new" className="text-primary hover:underline">
                  Create the first client
                </Link>
              </>
            ) : null}
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {clients.map((client) => (
              <li key={client.id}>
                <Link
                  href={`/clients/${client.id}`}
                  className="lf-list-hover flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-foreground">{client.name}</p>
                    {client.contactEmail ? (
                      <p className="text-sm text-muted-foreground">{client.contactEmail}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={riskLevel(client.riskScore)} label={`${client.riskScore}`} />
                    <span className="text-xs text-muted-foreground">
                      {riskBandLabel(riskBand(client.riskScore))}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </ShellPage>
  );
}
