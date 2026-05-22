import { RolePolicy } from '@lanceflow/auth';
import { listWorkersWithWorkload } from '@lanceflow/operations';
import { NextResponse } from 'next/server';

import { serializeWorker } from '@/lib/workers-api';
import { withAuthRoute } from '@/lib/api-auth';

/** List engineers with skills and active assignment count (OPS-004). */
export const GET = withAuthRoute('/api/workers', RolePolicy.workersRead, async () => {
  const workers = await listWorkersWithWorkload();
  return NextResponse.json({ items: workers.map(serializeWorker) });
});
