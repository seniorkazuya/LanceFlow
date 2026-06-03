import { MarketingThemeProvider } from '@/components/marketing/marketing-theme-provider';

import '@/styles/marketing.css';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <MarketingThemeProvider>{children}</MarketingThemeProvider>;
}
