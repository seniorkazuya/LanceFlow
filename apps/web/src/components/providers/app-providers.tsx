'use client';

import { ThemeProvider, useTheme } from 'next-themes';
import { Toaster } from 'sonner';

function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      theme={resolvedTheme === 'light' ? 'light' : 'dark'}
      richColors
      closeButton
      position="top-right"
      toastOptions={{ className: 'font-sans' }}
    />
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="lanceflow-theme">
      {children}
      <ThemedToaster />
    </ThemeProvider>
  );
}
