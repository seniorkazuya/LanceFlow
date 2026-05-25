import type { ProjectDisputeRecord } from '@lanceflow/operations';

export function serializeProjectDispute(d: ProjectDisputeRecord) {
  return {
    id: d.id,
    projectId: d.projectId,
    title: d.title,
    description: d.description,
    amountCents: d.amountCents,
    currency: d.currency,
    status: d.status,
    sopLinkId: d.sopLinkId,
    escalatedAt: d.escalatedAt?.toISOString() ?? null,
    resolvedAt: d.resolvedAt?.toISOString() ?? null,
    resolutionNote: d.resolutionNote,
    createdAt: d.createdAt.toISOString(),
  };
}
