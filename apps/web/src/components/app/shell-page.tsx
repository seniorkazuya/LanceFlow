import { cn } from '@lanceflow/ui';
import type { ReactNode } from 'react';

export type ShellPageProps = {
  children: ReactNode;
  className?: string;
};

/** Consistent max-width and spacing for authenticated app routes. */
export function ShellPage({ children, className }: ShellPageProps) {
  return (
    <div className={cn('relative mx-auto w-full max-w-4xl space-y-6', className)}>{children}</div>
  );
}
