'use client';

import { ThemeProvider } from 'next-themes';

/** Keeps public marketing pages on the light prototype theme (not app dark mode). */
export function MarketingThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" forcedTheme="light" enableSystem={false} storageKey="lanceflow-theme">
      {children}
    </ThemeProvider>
  );
}
