export type CompensationSuggestionStatus = 'pending' | 'approved' | 'rejected';

export type CompensationSuggestionRecord = {
  id: string;
  userId: string;
  userDisplayName: string;
  userRole: string;
  periodKey: string;
  kind: 'bonus' | 'penalty';
  percentBps: number;
  kpiScore: number;
  formulaVersion: string;
  status: CompensationSuggestionStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  createdAt: string;
};

export type CompensationSuggestionReviewInput = {
  action: 'approve' | 'reject';
  note?: string;
};
