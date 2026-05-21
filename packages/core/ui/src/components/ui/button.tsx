import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'rounded-full bg-primary text-primary-foreground shadow-[0_0_24px_hsl(var(--brand-teal)/0.35)] hover:bg-primary/90 hover:shadow-[0_0_32px_hsl(var(--brand-teal)/0.45)]',
        secondary:
          'rounded-full bg-white/[0.08] text-foreground hover:bg-white/[0.12] border border-white/10',
        ghost: 'rounded-full hover:bg-white/[0.06] text-foreground/90',
        outline:
          'rounded-full border border-white/15 bg-transparent text-foreground hover:bg-white/[0.05] hover:border-white/25',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-full px-4 text-xs',
        lg: 'h-11 rounded-full px-7 text-[0.9375rem]',
        icon: 'h-9 w-9 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }));

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
        className: cn(classes, (children as React.ReactElement<{ className?: string }>).props.className),
      });
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
