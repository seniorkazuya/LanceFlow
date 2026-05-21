import { RolePolicy, hasRole } from '@lanceflow/auth';
import { listClients } from '@lanceflow/operations';
import { GlassCard, PageHeader } from '@lanceflow/ui';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ShellPage } from '@/components/app/shell-page';
import { ProjectForm } from '@/components/projects/project-form';
import { auth } from '@/auth';

export default async function NewProjectPage() {
  const session = await auth();
  const role = session?.user?.role ?? '';
  if (!hasRole(role, RolePolicy.projectsWrite)) {
    redirect('/projects');
  }

  const clients = await listClients(false);

  return (
    <ShellPage>
      <PageHeader label="operations" title="New project" description="Starts in draft with client risk snapshot." />
      <GlassCard className="p-6 md:p-8">
        {clients.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Create a{' '}
            <Link href="/clients/new" className="text-primary hover:underline">
              client
            </Link>{' '}
            first.
          </p>
        ) : (
          <ProjectForm clients={clients.map((c) => ({ id: c.id, name: c.name }))} />
        )}
      </GlassCard>
    </ShellPage>
  );
}
