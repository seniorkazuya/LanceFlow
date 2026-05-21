import { StatusBadge } from '@lanceflow/ui';
import { RolePolicy, hasRole } from '@lanceflow/auth';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';

export default async function ControlPage() {
  const session = await auth();
  const role = session?.user?.role ?? '';
  if (!hasRole(role, RolePolicy.controlCenter)) {
    redirect('/dashboard');
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Control Center</h1>
      <p className="text-sm text-muted-foreground">
        CEO and Ops oversight — aggregates connect in later stories.
      </p>
      <StatusBadge status="success" label="KPIs nominal" />
    </div>
  );
}
