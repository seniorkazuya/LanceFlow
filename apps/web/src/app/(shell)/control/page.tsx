import { PageHeader } from '@lanceflow/ui';
import { RolePolicy, hasRole } from '@lanceflow/auth';
import { UserRole } from '@lanceflow/types';
import { redirect } from 'next/navigation';

import { ControlCenterSummaryPanel } from '@/components/control/control-center-summary-panel';
import { ExceptionInbox } from '@/components/control/exception-inbox';
import { KpiThresholdsPanel } from '@/components/control/kpi-thresholds-panel';
import { ShellPage } from '@/components/app/shell-page';
import { auth } from '@/auth';

export default async function ControlPage() {
  const session = await auth();
  const role = session?.user?.role ?? '';
  if (!hasRole(role, RolePolicy.controlCenter)) {
    redirect('/dashboard');
  }
  const isCeo = role === UserRole.CEO;

  return (
    <ShellPage>
      <PageHeader
        label="oversight"
        title="Control Center"
        description="Company signals and exception inbox for CEO and Ops (KPI-003, AUTO-008)."
      />

      {isCeo ? <KpiThresholdsPanel /> : null}
      <ControlCenterSummaryPanel />
      <ExceptionInbox />
    </ShellPage>
  );
}
