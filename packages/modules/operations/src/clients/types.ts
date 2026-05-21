export const CLIENT_STATUSES = ['active', 'archived'] as const;
export type ClientStatus = (typeof CLIENT_STATUSES)[number];

export const RISK_SCORE_SOURCES = ['default', 'evaluated', 'manual'] as const;
export type RiskScoreSource = (typeof RISK_SCORE_SOURCES)[number];

export type ClientRecord = {
  id: string;
  name: string;
  contactEmail: string | null;
  status: ClientStatus;
  riskScore: number;
  riskScoreSource: RiskScoreSource;
  riskFormulaVersion: string | null;
  riskOverrideReason: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type OverrideClientRiskInput = {
  riskScore: number;
  reason: string;
};

export type CreateClientInput = {
  name: string;
  contactEmail?: string | null;
  riskScore?: number;
  notes?: string | null;
};

export type UpdateClientInput = {
  name?: string;
  contactEmail?: string | null;
  status?: ClientStatus;
  notes?: string | null;
};

export type ClientValidationError = {
  field: string;
  message: string;
};
