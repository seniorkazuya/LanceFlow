import * as React from 'react';

import { cn } from '../lib/utils';

export type SectionLabelProps = React.HTMLAttributes<HTMLParagraphElement>;

/** Screenpipe-style section eyebrow (e.g. "workflow report pilot"). */
export function SectionLabel({ className, children, ...props }: SectionLabelProps) {
  return (
    <p className={cn('lf-section-label', className)} {...props}>
      {children}
    </p>
  );
}
