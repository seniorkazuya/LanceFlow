export const DISPUTE_STATUSES = ['open', 'investigating', 'escalated', 'resolved'] as const;
export type DisputeStatus = (typeof DISPUTE_STATUSES)[number];

/** CEO leadership inbox when dispute amount meets/exceeds this (cents). */
export const DISPUTE_CEO_ESCALATION_CENTS = 50_000;

export const DISPUTE_SOP_LINK_ID = 'payments-dispute';

export type CreateProjectDisputeInput = {
  title: string;
  description?: string | null;
  amountCents: number;
  currency?: string;
};

export type TransitionProjectDisputeInput = {
  status: DisputeStatus;
  resolutionNote?: string | null;
};

export type ProjectDisputeRecord = {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  amountCents: number;
  currency: string;
  status: DisputeStatus;
  sopLinkId: string | null;
  escalatedAt: Date | null;
  escalatedBy: string | null;
  resolvedAt: Date | null;
  resolvedBy: string | null;
  resolutionNote: string | null;
  createdAt: Date;
  updatedAt: Date;
};
