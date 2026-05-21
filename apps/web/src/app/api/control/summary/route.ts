import { RolePolicy } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

import { withAuthRoute } from '@/lib/api-auth';

/** Control-center summary — CEO and Ops only (CORE-003). */
export const GET = withAuthRoute('/api/control/summary', RolePolicy.controlCenter, async () => {
  return NextResponse.json({
    scope: 'control-center',
    message: 'Ops oversight summary placeholder',
  });
});
