import type { Metadata } from 'next';

import { AuthSessionProvider } from '@/components/providers/session-provider';

import './globals.css';

export const metadata: Metadata = {
  title: 'LanceFlow',
  description: 'Where Strong Action Meets Seamless Flow.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
