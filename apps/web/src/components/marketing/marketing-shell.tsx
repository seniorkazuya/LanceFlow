import { Plus_Jakarta_Sans } from 'next/font/google';
import type { ReactNode } from 'react';

import { LandingFooter } from '@/components/marketing/landing-footer';
import { LandingNav, type MarketingNavPage } from '@/components/marketing/landing-nav';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export type { MarketingNavPage };

export function MarketingShell({
  activePage,
  children,
}: {
  activePage: MarketingNavPage;
  children: ReactNode;
}) {
  return (
    <div className={`marketing-site ${plusJakarta.className} min-h-screen w-full bg-[var(--bg)]`}>
      <LandingNav activePage={activePage} />
      {children}
      <LandingFooter />
    </div>
  );
}
