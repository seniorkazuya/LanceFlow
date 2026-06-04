import { LandingFooter } from '@/components/marketing/landing-footer';
import { LandingNav } from '@/components/marketing/landing-nav';
import { MarketingThemeProvider } from '@/components/marketing/marketing-theme-provider';
import { marketingFont } from '@/lib/marketing-font';

import '@/styles/marketing.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <MarketingThemeProvider>
      <div className={`marketing-site ${marketingFont.className} min-h-screen w-full bg-[var(--bg)]`}>
        <LandingNav />
        {children}
        <LandingFooter />
      </div>
    </MarketingThemeProvider>
  );
}
