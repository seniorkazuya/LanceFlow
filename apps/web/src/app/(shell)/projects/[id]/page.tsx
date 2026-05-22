import { RolePolicy, hasRole } from '@lanceflow/auth';
import { isAutoAssignEnabled } from '@lanceflow/config';
import { allowedTransitionsFrom, getProjectById, listProjectAssignments } from '@lanceflow/operations';
import { GlassCard, PageHeader, SectionLabel, StatusBadge } from '@lanceflow/ui';
import { notFound, redirect } from 'next/navigation';

import { ShellPage } from '@/components/app/shell-page';
import { ProjectAssignmentPanel } from '@/components/projects/project-assignment-panel';
import { ProjectAutoAssignPanel } from '@/components/projects/project-auto-assign-panel';
import { ProjectAutoApprovePanel } from '@/components/projects/project-auto-approve-panel';
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
  const autoAssignEnabled = isAutoAssignEnabled();
  const nextStatuses = allowedTransitionsFrom(project.status);
  const assignments = await listProjectAssignments(id);

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
          <div className="mt-6 space-y-4">
            <ProjectAutoApprovePanel projectId={project.id} projectStatus={project.status} />
            <ProjectTransitionButtons
              projectId={project.id}
              currentStatus={project.status}
              allowedNext={nextStatuses}
            />
          </div>
        ) : null}
      </GlassCard>

      <GlassCard className="p-5 md:p-6">
        <SectionLabel>assignments</SectionLabel>
        {assignments.length > 0 ? (
          <ul className="mt-4 space-y-2 text-sm">
            {assignments.map((a) => (
              <li key={a.id} className="flex flex-wrap justify-between gap-2">
                <span className="font-medium text-foreground">{a.engineerName}</span>
                <span className="text-muted-foreground">
                  Score {a.skillScore ?? '—'} · {a.formulaVersion ?? 'manual'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No active assignments.</p>
        )}
        {canWrite ? (
          <div className="mt-6 border-t border-white/[0.06] pt-6 space-y-6">
            <ProjectAutoAssignPanel
              projectId={project.id}
              projectStatus={project.status}
              autoAssignEnabled={autoAssignEnabled}
            />
            <ProjectAssignmentPanel projectId={project.id} projectStatus={project.status} />
          </div>
        ) : null}
      </GlassCard>
    </ShellPage>
  );
}
