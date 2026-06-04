import { postLoginPathForRole } from '@lanceflow/auth';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  const role = session?.user?.role;
  if (!role) {
    redirect('/auth/signin');
  }

  redirect(postLoginPathForRole(role));
}
