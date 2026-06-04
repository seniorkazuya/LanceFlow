'use client';

import { MarketingAppShell, type MarketingAppShellProps } from '@/components/app/marketing-app-shell';

export type ShellLayoutClientProps = MarketingAppShellProps;

export function ShellLayoutClient(props: ShellLayoutClientProps) {
  return <MarketingAppShell {...props} />;
}
