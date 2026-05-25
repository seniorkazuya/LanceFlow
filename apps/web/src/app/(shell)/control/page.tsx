import { PageHeader } from '@lanceflow/ui';
import { RolePolicy, hasRole } from '@lanceflow/auth';
import { redirect } from 'next/navigation';

import { ControlCenterSummaryPanel } from '@/components/control/control-center-summary-panel';
import { ExceptionInbox } from '@/components/control/exception-inbox';
import { ShellPage } from '@/components/app/shell-page';
import { auth } from '@/auth';

export default async function ControlPage() {
  const session = await auth();
  const role = session?.user?.role ?? '';
  if (!hasRole(role, RolePolicy.controlCenter)) {
    redirect('/dashboard');
  }

  return (
    <ShellPage>
      <PageHeader
        label="oversight"
        title="Control Center"
        description="Company signals and exception inbox for CEO and Ops (KPI-003, AUTO-008)."
      />

      <ControlCenterSummaryPanel />
      <ExceptionInbox />
    </ShellPage>
  );
}
