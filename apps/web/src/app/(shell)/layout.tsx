import { redirect } from 'next/navigation';

import { auth, signOut } from '@/auth';
import { ShellLayoutClient } from '@/components/app/shell-layout-client';
import { Button } from '@lanceflow/ui';

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
      <Button type="submit" variant="ghost" size="sm">
        Sign out
      </Button>
    </form>
  );

  return (
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
  );
}
