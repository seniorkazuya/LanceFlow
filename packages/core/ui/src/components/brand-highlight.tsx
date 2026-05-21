import * as React from 'react';

import { cn } from '../lib/utils';

export type BrandHighlightProps = {
  children: React.ReactNode;
  className?: string;
  /** Stronger teal glow for hero lockups */
  glow?: 'default' | 'strong';
  label?: string;
};

/** Frames brand assets with a modern highlight ring (landing hero). */
export function BrandHighlight({
  children,
  className,
  glow = 'default',
  label,
}: BrandHighlightProps) {
  return (
    <figure className={cn('flex flex-col items-center gap-3', className)}>
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl p-6 transition-transform duration-300 hover:scale-[1.02]',
          glow === 'strong' ? 'lf-brand-glow-strong' : 'lf-brand-glow',
          'bg-gradient-to-br from-brand-navy/80 via-secondary/90 to-brand-teal/10',
          'border border-white/10'
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent"
          aria-hidden
        />
        {children}
      </div>
      {label ? (
        <figcaption className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
}
