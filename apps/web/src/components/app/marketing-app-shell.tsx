'use client';

import { LandingFooter } from '@/components/marketing/landing-footer';
import type { ReactNode } from 'react';

import { AppNav, type AppNavProps } from '@/components/app/app-nav';

export type MarketingAppShellProps = AppNavProps & {
  children: ReactNode;
};

export function MarketingAppShell({ user, signOutAction, children }: MarketingAppShellProps) {
  return (
    <div className="app-marketing-layout">
      <AppNav user={user} signOutAction={signOutAction} />
      <main className="app-content-wrap">
        <div className="wrap">{children}</div>
      </main>
      <LandingFooter />
    </div>
  );
}
