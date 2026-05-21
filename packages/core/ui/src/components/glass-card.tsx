import * as React from 'react';

import { cn } from '../lib/utils';

export type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'strong';
};

export function GlassCard({ className, variant = 'default', children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(variant === 'strong' ? 'lf-glass-strong' : 'lf-glass', className)}
      {...props}
    >
      {children}
    </div>
  );
}
