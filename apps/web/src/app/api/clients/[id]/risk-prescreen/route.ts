import { runClientRiskPrescreen } from '@lanceflow/automation';
import { RolePolicy, authorizeRequest } from '@lanceflow/auth';
import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { sessionToUser } from '@/lib/api-auth';
import { withApiLogging } from '@/lib/api-route';
import { parseJsonBody } from '@/lib/clients-api';
import { revalidateClients } from '@/lib/revalidate-paths';

type RouteContext = { params: Promise<{ id: string }> };

/** AUTO-006 — pre-screen client risk (Bidder/Ops/CEO) with RuleDecision + audit. */
export const POST = withApiLogging(
  '/api/clients/[id]/risk-prescreen',
  async (request: Request, context?: unknown) => {
    const session = await getAuthSession();
    const authz = authorizeRequest(sessionToUser(session), RolePolicy.clientRiskPrescreen);
    if (!authz.ok) {
      return NextResponse.json({ error: authz.error }, { status: authz.status });
    }

    const { id } = await (context as RouteContext).params;
    const body = await parseJsonBody<{ persist?: boolean }>(request);
    const persist = body?.persist === true;

    const result = await runClientRiskPrescreen(id, authz.user.id, { persist });
    if (!result.ok) {
      const status = result.errors.some((e) => e.field === 'clientId') ? 404 : 400;
      return NextResponse.json({ errors: result.errors }, { status });
    }

    if (persist) {
      revalidateClients(id);
    }

    return NextResponse.json({
      score: result.score,
      band: result.band,
      recommendation: result.recommendation,
      persisted: result.persisted,
      clientRiskScore: result.clientRiskScore,
      decision: {
        id: result.decision.id,
        outcome: result.decision.outcome,
        formulaVersion: result.decision.formulaVersion,
        explanation: result.decision.explanation,
        createdAt: result.decision.createdAt.toISOString(),
      },
    });
  }
);
