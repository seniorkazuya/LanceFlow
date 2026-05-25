import { ingestAssessmentWebhook } from '@lanceflow/hiring';
import { NextResponse } from 'next/server';

import { withApiLogging } from '@/lib/api-route';

/** External coding-test webhook placeholder (HIRE-003) — secret header required. */
export const POST = withApiLogging('/api/hiring/assessments/webhook', async (request: Request) => {
  const secret = request.headers.get('x-hiring-assessment-secret');
  const body = (await request.json()) as {
    applicationId?: string;
    technicalScore?: unknown;
  };

  if (!body.applicationId) {
    return NextResponse.json(
      { errors: [{ field: 'applicationId', message: 'applicationId is required' }] },
      { status: 400 }
    );
  }

  const result = await ingestAssessmentWebhook(
    {
      applicationId: body.applicationId,
      technicalScore: Number(body.technicalScore),
    },
    secret
  );

  if (!result.ok) {
    if ('status' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  return NextResponse.json({
    applicationId: result.application.id,
    technicalScore: result.application.technicalScore,
  });
});
