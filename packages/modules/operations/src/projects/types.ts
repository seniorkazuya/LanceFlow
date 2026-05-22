export const PROJECT_STATUSES = [
  'draft',
  'pending_approval',
  'active',
  'delivered',
  'closed',
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export type ProjectRecord = {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  status: ProjectStatus;
  scopeClarityPct: number | null;
  profitMarginPct: number | null;
  clientRiskAtCreate: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProjectInput = {
  clientId: string;
  title: string;
  scopeClarityPct?: number | null;
  profitMarginPct?: number | null;
};

export type UpdateProjectInput = {
  title?: string;
  scopeClarityPct?: number | null;
  profitMarginPct?: number | null;
};

export type ProjectValidationError = {
  field: string;
  message: string;
};
