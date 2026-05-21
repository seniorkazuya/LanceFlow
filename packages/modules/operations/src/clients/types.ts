export const CLIENT_STATUSES = ['active', 'archived'] as const;
export type ClientStatus = (typeof CLIENT_STATUSES)[number];

export type ClientRecord = {
  id: string;
  name: string;
  contactEmail: string | null;
  status: ClientStatus;
  riskScore: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
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
  riskScore?: number;
  notes?: string | null;
};

export type ClientValidationError = {
  field: string;
  message: string;
};
