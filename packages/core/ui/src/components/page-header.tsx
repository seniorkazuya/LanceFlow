import type { ReactNode } from 'react';

import { cn } from '../lib/utils';
import { SectionLabel } from './section-label';

export type PageHeaderProps = {
  label?: string;
  title: string;
  description?: ReactNode;
  className?: string;
  /** Right-aligned slot (e.g. sign out, actions) */
  action?: ReactNode;
};

export function PageHeader({ label, title, description, className, action }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 border-b border-white/[0.06] pb-6 sm:flex-row sm:items-end sm:justify-between',
        className
      )}
    >
      <div className="min-w-0">
        {label ? <SectionLabel>{label}</SectionLabel> : null}
        <h1 className={cn('text-2xl font-semibold tracking-tight md:text-3xl', label && 'mt-2')}>
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
