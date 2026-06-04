import { redirect } from 'next/navigation';

import { auth, signOut } from '@/auth';
import { ShellLayoutClient } from '@/components/app/shell-layout-client';
import { MarketingThemeProvider } from '@/components/marketing/marketing-theme-provider';
import { marketingFont } from '@/lib/marketing-font';

import '@/styles/marketing.css';

export default async function ShellLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.email || !session.user.role) {
    redirect('/auth/signin');
  }

  const signOutAction = (
    <form
      action={async () => {
        'use server';
        await signOut({ redirectTo: '/' });
      }}
    >
      <button type="submit" className="site-menu-signout">
        Sign out
      </button>
    </form>
  );

  return (
    <MarketingThemeProvider>
      <div className={`marketing-site marketing-app ${marketingFont.className} min-h-screen w-full`}>
        <ShellLayoutClient
          user={{
            email: session.user.email,
            displayName: session.user.name,
            role: session.user.role,
          }}
          signOutAction={signOutAction}
        >
          {children}
        </ShellLayoutClient>
      </div>
    </MarketingThemeProvider>
  );
}
