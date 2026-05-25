import { redirect } from 'next/navigation';

/** KPI-004 alias — Control Center lives at /control. */
export default function ControlCenterAliasPage() {
  redirect('/control');
}
