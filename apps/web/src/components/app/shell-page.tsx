import { cn } from '@lanceflow/ui';
import type { ReactNode } from 'react';

import { AppPageBar } from '@/components/app/app-page-bar';

export type ShellPageProps = {
  children: ReactNode;
  className?: string;
};

/** Consistent max-width and spacing for authenticated app routes. */
export function ShellPage({ children, className }: ShellPageProps) {
  return (
    <div className={cn('app-page', className)}>
      <AppPageBar />
      {children}
    </div>
  );
}
