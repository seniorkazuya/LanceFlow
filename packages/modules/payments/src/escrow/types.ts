export type WorkGatingReason = 'escrow_held' | 'overdue_payment' | null;

export type WorkGatingStatus = {
  projectId: string;
  blocked: boolean;
  reason: WorkGatingReason;
  escrowHeld: boolean;
  overrideActive: boolean;
  overduePaymentCount: number;
  message: string;
};

export type EscrowOverrideInput = {
  action: 'release' | 'clear_override' | 'hold' | 'unhold';
  reason?: string;
};
