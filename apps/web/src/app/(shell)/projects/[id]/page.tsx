import { RolePolicy, hasRole } from '@lanceflow/auth';
import { allowedTransitionsFrom, getProjectById } from '@lanceflow/operations';
import { GlassCard, PageHeader, SectionLabel, StatusBadge } from '@lanceflow/ui';
import { notFound, redirect } from 'next/navigation';

import { ShellPage } from '@/components/app/shell-page';
import { ProjectTransitionButtons } from '@/components/projects/project-transition-buttons';
import { auth } from '@/auth';

type PageProps = { params: Promise<{ id: string }> };

export default async function ProjectDetailPage({ params }: PageProps) {
  const session = await auth();
  const role = session?.user?.role ?? '';
  if (!hasRole(role, RolePolicy.projectsRead)) {
    redirect('/dashboard');
  }

  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) {
    notFound();
  }

  const canWrite = hasRole(role, RolePolicy.projectsWrite);
  const nextStatuses = allowedTransitionsFrom(project.status);

  return (
    <ShellPage>
      <PageHeader
        label="project"
        title={project.title}
        description={`Client: ${project.clientName} · Risk at create: ${project.clientRiskAtCreate ?? '—'}`}
      />

      <GlassCard className="p-5 md:p-6">
        <SectionLabel>lifecycle</SectionLabel>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <StatusBadge status="neutral" label={project.status.replace('_', ' ')} />
          <span className="text-sm text-muted-foreground">
            Scope {project.scopeClarityPct ?? '—'}% · Margin {project.profitMarginPct ?? '—'}%
          </span>
        </div>
        {canWrite ? (
          <div className="mt-6">
            <ProjectTransitionButtons
              projectId={project.id}
              currentStatus={project.status}
              allowedNext={nextStatuses}
            />
          </div>
        ) : null}
      </GlassCard>
    </ShellPage>
  );
}
