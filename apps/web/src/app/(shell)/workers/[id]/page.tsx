import { RolePolicy, hasRole } from '@lanceflow/auth';
import { getWorkerById } from '@lanceflow/operations';
import { GlassCard, PageHeader, SectionLabel } from '@lanceflow/ui';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { ShellPage } from '@/components/app/shell-page';
import { WorkerSkillsForm } from '@/components/workers/worker-skills-form';
import { auth } from '@/auth';

type PageProps = { params: Promise<{ id: string }> };

export default async function WorkerDetailPage({ params }: PageProps) {
  const session = await auth();
  const role = session?.user?.role ?? '';
  if (!hasRole(role, RolePolicy.workersRead)) {
    redirect('/dashboard');
  }

  const { id } = await params;
  const worker = await getWorkerById(id);
  if (!worker) {
    notFound();
  }

  const canWrite = hasRole(role, RolePolicy.workersWrite);

  return (
    <ShellPage>
      <PageHeader
        label="engineer"
        title={worker.displayName}
        description={worker.email}
      />

      <GlassCard className="p-5 md:p-6">
        <SectionLabel>workload</SectionLabel>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Active assignments</dt>
            <dd className="font-medium text-foreground">{worker.activeAssignmentCount}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="font-medium capitalize text-foreground">{worker.status}</dd>
          </div>
        </dl>
      </GlassCard>

      <GlassCard className="p-5 md:p-6">
        <SectionLabel>skills</SectionLabel>
        {canWrite ? (
          <div className="mt-4">
            <WorkerSkillsForm workerId={worker.id} initialTags={worker.skillTags} />
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            {worker.skillTags.length > 0 ? worker.skillTags.join(', ') : 'No skills tagged.'}
          </p>
        )}
      </GlassCard>

      <p className="text-sm">
        <Link href="/workers" className="text-primary hover:underline">
          ← Back to team workload
        </Link>
      </p>
    </ShellPage>
  );
}
