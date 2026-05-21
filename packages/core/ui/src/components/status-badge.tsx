import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../lib/utils';

/** Operational status colors — green / yellow / red (CORE-004). */
export const statusBadgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
  {
    variants: {
      status: {
        success: 'border-success/40 bg-success/15 text-success',
        warning: 'border-warning/40 bg-warning/15 text-warning',
        danger: 'border-destructive/40 bg-destructive/15 text-destructive',
        neutral: 'border-border bg-secondary text-muted-foreground',
      },
    },
    defaultVariants: {
      status: 'neutral',
    },
  }
);

export type StatusLevel = 'success' | 'warning' | 'danger' | 'neutral';

export type StatusBadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof statusBadgeVariants> & {
    label: string;
  };

export function statusToLevel(value: string): StatusLevel {
  const normalized = value.trim().toLowerCase();
  if (['ok', 'healthy', 'active', 'approved', 'success', 'green'].includes(normalized)) {
    return 'success';
  }
  if (['warn', 'warning', 'pending', 'degraded', 'yellow'].includes(normalized)) {
    return 'warning';
  }
  if (['error', 'failed', 'blocked', 'critical', 'danger', 'red'].includes(normalized)) {
    return 'danger';
  }
  return 'neutral';
}

export function StatusBadge({ className, status, label, ...props }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ status }), className)} {...props}>
      {label}
    </span>
  );
}
