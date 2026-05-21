import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { withApiLogging } from '@/lib/api-route';

export const GET = withApiLogging('/api/me', async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    id: session.user.id,
    email: session.user.email,
    role: session.user.role,
    name: session.user.name,
  });
});
