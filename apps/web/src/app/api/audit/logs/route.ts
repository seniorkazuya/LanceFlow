import { queryAuditLogs } from '@lanceflow/audit';
import { RolePolicy } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

import { withAuthRoute } from '@/lib/api-auth';

function parsePositiveInt(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/** Paginated audit log — CEO read-only (CORE-006). */
export const GET = withAuthRoute('/api/audit/logs', RolePolicy.auditRead, async (request) => {
  const { searchParams } = new URL(request.url);
  const page = parsePositiveInt(searchParams.get('page'), 1);
  const pageSize = parsePositiveInt(searchParams.get('pageSize'), 20);

  const result = await queryAuditLogs({ page, pageSize });

  return NextResponse.json({
    ...result,
    items: result.items.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
    })),
  });
});
