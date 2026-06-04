import { RolePolicy, hasRole } from '@lanceflow/auth';
import { listProjects, listProjectsForPortalClient } from '@lanceflow/operations';
import { UserRole } from '@lanceflow/types';
import { Button, GlassCard, PageHeader, StatusBadge } from '@lanceflow/ui';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ShellPage } from '@/components/app/shell-page';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

function statusTone(status: string): 'neutral' | 'warning' | 'success' {
  if (status === 'active') return 'success';
  if (status === 'pending_approval') return 'warning';
  return 'neutral';
}

export default async function ProjectsPage() {
  const session = await auth();
  const role = session?.user?.role ?? '';
  const email = session?.user?.email ?? '';
  const isPortalClient = role === UserRole.CLIENT;

  if (isPortalClient) {
    if (!hasRole(role, RolePolicy.clientProjectsRead)) {
      redirect('/dashboard');
    }
  } else if (!hasRole(role, RolePolicy.projectsRead)) {
    redirect('/dashboard');
  }

  const canWrite = hasRole(role, RolePolicy.projectsWrite);
  const projects = isPortalClient
    ? await listProjectsForPortalClient(email)
    : await listProjects();

  return (
    <ShellPage>
      <PageHeader
        label={isPortalClient ? 'portal' : 'operations'}
        title={isPortalClient ? 'My projects' : 'Projects'}
        description={
          isPortalClient
            ? 'Projects linked to your account email. Ask your LanceFlow contact to set your email on the client record if nothing appears here.'
            : 'Lifecycle: draft → pending approval → active → delivered → closed.'
        }
        action={
          canWrite ? (
            <Button asChild size="sm">
              <Link href="/projects/new">New project</Link>
            </Button>
          ) : null
        }
      />

      <GlassCard className="overflow-hidden p-0">
        {projects.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">
            {isPortalClient
              ? 'No projects are linked to your email yet.'
              : 'No projects yet.'}
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {projects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/projects/${p.id}`}
                  className="lf-list-hover flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-foreground">{p.title}</p>
                    {!isPortalClient ? (
                      <p className="text-sm text-muted-foreground">{p.clientName}</p>
                    ) : null}
                  </div>
                  <StatusBadge status={statusTone(p.status)} label={p.status.replace('_', ' ')} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </ShellPage>
  );
}
