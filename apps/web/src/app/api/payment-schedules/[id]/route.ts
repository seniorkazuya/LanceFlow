import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { updatePaymentSchedule } from '@lanceflow/payments';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';
import { parseJsonBody } from '@/lib/clients-api';
import { serializePaymentSchedule } from '@/lib/payment-schedules-api';
import { revalidateProjects } from '@/lib/revalidate-paths';

type RouteContext = { params: Promise<{ id: string }> };

export const PATCH = withApiLogging(
  '/api/payment-schedules/[id]',
  async (request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const authz = authorizeRequest(sessionToUser(session), RolePolicy.projectsWrite);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const body = await parseJsonBody<{
      dueDate?: string;
      amountCents?: number;
      status?: string;
      escalationLevel?: number;
      notes?: string | null;
    }>(request);

    if (!body) {
      return NextResponse.json(
        { errors: [{ field: 'body', message: 'Invalid JSON body' }] },
        { status: 400 }
      );
    }

    const result = await updatePaymentSchedule(id, body, authz.user.id);
    if (!result.ok) {
      const status = result.errors.some((e) => e.field === 'id') ? 404 : 400;
      return NextResponse.json({ errors: result.errors }, { status });
    }

    revalidateProjects(result.schedule.projectId);
    return NextResponse.json({ schedule: serializePaymentSchedule(result.schedule) });
  }
);
