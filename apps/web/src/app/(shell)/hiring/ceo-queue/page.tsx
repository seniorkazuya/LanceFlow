import { StatusBadge } from '@lanceflow/ui';
import { RolePolicy, hasRole } from '@lanceflow/auth';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';

export default async function HiringCeoQueuePage() {
  const session = await auth();
  const role = session?.user?.role ?? '';
  if (!hasRole(role, RolePolicy.hiringCeoQueue)) {
    redirect('/dashboard');
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Hiring CEO Queue</h1>
      <p className="text-sm text-muted-foreground">
        Engineers are redirected — matches API RBAC on <code>/api/hiring/ceo-queue</code>.
      </p>
      <StatusBadge status="warning" label="3 pending CEO decisions" />
    </div>
  );
}
