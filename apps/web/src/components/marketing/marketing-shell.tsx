import type { ReactNode } from 'react';

import { LandingFooter } from '@/components/marketing/landing-footer';
import { LandingNav, type MarketingNavPage } from '@/components/marketing/landing-nav';
import { marketingFont } from '@/lib/marketing-font';

export type { MarketingNavPage };

export function MarketingShell({
  activePage,
  children,
}: {
  activePage?: MarketingNavPage;
  children: ReactNode;
}) {
  return (
    <div className={`marketing-site ${marketingFont.className} min-h-screen w-full bg-[var(--bg)]`}>
      <LandingNav activePage={activePage} />
      {children}
      <LandingFooter />
    </div>
  );
}
