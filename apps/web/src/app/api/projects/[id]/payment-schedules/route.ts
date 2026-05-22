import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import {
  createPaymentSchedule,
  listPaymentSchedulesForProject,
} from '@lanceflow/payments';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';
import { parseJsonBody } from '@/lib/clients-api';
import { serializePaymentSchedule } from '@/lib/payment-schedules-api';
import { revalidateProjects } from '@/lib/revalidate-paths';

type RouteContext = { params: Promise<{ id: string }> };

export const GET = withApiLogging(
  '/api/projects/[id]/payment-schedules',
  async (_request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const authz = authorizeRequest(sessionToUser(session), RolePolicy.projectsRead);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const items = await listPaymentSchedulesForProject(id);
    if (items === null) {
      return NextResponse.json({ errors: [{ field: 'projectId', message: 'Project not found' }] }, { status: 404 });
    }

    return NextResponse.json({ items: items.map(serializePaymentSchedule) });
  }
);

export const POST = withApiLogging(
  '/api/projects/[id]/payment-schedules',
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
      currency?: string;
      notes?: string | null;
    }>(request);

    if (!body?.dueDate || body.amountCents === undefined) {
      return NextResponse.json(
        {
          errors: [
            { field: 'dueDate', message: 'dueDate is required' },
            { field: 'amountCents', message: 'amountCents is required' },
          ],
        },
        { status: 400 }
      );
    }

    const result = await createPaymentSchedule(
      id,
      {
        dueDate: body.dueDate,
        amountCents: body.amountCents,
        currency: body.currency,
        notes: body.notes,
      },
      authz.user.id
    );

    if (!result.ok) {
      const status = result.errors.some((e) => e.field === 'projectId') ? 404 : 400;
      return NextResponse.json({ errors: result.errors }, { status });
    }

    revalidateProjects(id);
    return NextResponse.json(
      { schedule: serializePaymentSchedule(result.schedule) },
      { status: 201 }
    );
  }
);
