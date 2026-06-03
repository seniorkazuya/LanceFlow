import {
  getExceptionInboxSummary,
  listLeadershipExceptions,
  syncLeadershipExceptions,
} from '@lanceflow/automation';
import { RolePolicy } from '@lanceflow/auth';
import { UserRole } from '@lanceflow/types';
import { NextResponse } from 'next/server';

import { withAuthRoute } from '@/lib/api-auth';
import { serializeException } from '@/lib/exceptions-api';

const ceoSevereOnly = { minSeverity: 'danger' as const };

/** Leadership exception inbox — CEO sees critical only; Ops sees all (AUTO-008, PAY-004). */
export const GET = withAuthRoute(
  '/api/control/exceptions',
  RolePolicy.controlCenter,
  async (request, { user }) => {
    const url = new URL(request.url);
    const sync = url.searchParams.get('sync') === 'true';
    const status = url.searchParams.get('status') ?? 'active';
    const severeOnly = user.role === UserRole.CEO;
    const filter = severeOnly ? ceoSevereOnly : undefined;

    if (sync) {
      await syncLeadershipExceptions();
    }

    const items = await listLeadershipExceptions({
      status: status === 'all' ? undefined : (status as 'active' | 'open' | 'acknowledged'),
      ...filter,
    });

    const filteredSummary = severeOnly
      ? {
          open: items.filter((i) => i.status === 'open').length,
          danger: items.filter((i) => i.severity === 'danger').length,
          warning: 0,
          success: 0,
        }
      : await getExceptionInboxSummary();

    return NextResponse.json({
      summary: filteredSummary,
      items: items.map(serializeException),
      severeOnly,
    });
  }
);

export const POST = withAuthRoute(
  '/api/control/exceptions',
  RolePolicy.controlCenter,
  async (_request, { user }) => {
    const severeOnly = user.role === UserRole.CEO;
    const filter = severeOnly ? ceoSevereOnly : undefined;

    await syncLeadershipExceptions();
    const items = await listLeadershipExceptions({ status: 'active', ...filter });

    const summary = {
      open: items.filter((i) => i.status === 'open').length,
      danger: items.filter((i) => i.severity === 'danger').length,
      warning: severeOnly ? 0 : items.filter((i) => i.severity === 'warning').length,
      success: severeOnly ? 0 : items.filter((i) => i.severity === 'success').length,
    };

    return NextResponse.json({
      summary,
      items: items.map(serializeException),
      severeOnly,
    });
  }
);
