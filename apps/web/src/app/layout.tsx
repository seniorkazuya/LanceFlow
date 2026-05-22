import type { Metadata } from 'next';

import { AppProviders } from '@/components/providers/app-providers';
import { AuthSessionProvider } from '@/components/providers/session-provider';

import '@lanceflow/ui/globals.css';

export const metadata: Metadata = {
  title: 'LanceFlow',
  description: 'Where Strong Action Meets Seamless Flow.',
  icons: {
    icon: '/brand/lanceflow-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>
          <AuthSessionProvider>{children}</AuthSessionProvider>
        </AppProviders>
      </body>
    </html>
  );
}
