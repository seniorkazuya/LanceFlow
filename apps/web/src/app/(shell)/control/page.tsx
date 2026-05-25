import { PageHeader } from '@lanceflow/ui';
import { RolePolicy, hasRole } from '@lanceflow/auth';
import { redirect } from 'next/navigation';

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
        description="Exception inbox for CEO and Ops — red, yellow, and green severity from rules, payments, and assignments (AUTO-008)."
      />

      <ExceptionInbox />
    </ShellPage>
  );
}
