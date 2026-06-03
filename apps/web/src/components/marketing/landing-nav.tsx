'use client';

import type { ReactNode } from 'react';

import { SiteHeader } from '@/components/marketing/site-header';
import type { MarketingNavPage } from '@/components/marketing/site-nav-config';

type LandingNavProps = {
  activePage?: MarketingNavPage;
};

/** Landing / marketing pages — thin wrapper around unified SiteHeader. */
export function LandingNav({ activePage }: LandingNavProps) {
  return <SiteHeader variant="marketing" activePage={activePage} />;
}

export type { MarketingNavPage };
