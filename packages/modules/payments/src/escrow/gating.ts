import { daysOverdueUtc } from '../escalation/compute';
import type { WorkGatingReason, WorkGatingStatus } from './types';

type ProjectEscrowRow = {
  id: string;
  escrowHeld: boolean;
  escrowOverrideAt: Date | null;
};

type OverdueScheduleRow = {
  id: string;
  dueDate: Date;
  status: string;
};

/** Forward progress transitions blocked when gating is active (PAY-002). */
export const PROGRESS_TRANSITION_TARGETS = new Set([
  'active',
  'delivered',
  'closed',
]);

export function isProgressTransition(toStatus: string): boolean {
  return PROGRESS_TRANSITION_TARGETS.has(toStatus);
}

export function evaluateWorkGatingFromData(
  project: ProjectEscrowRow,
  overdueSchedules: OverdueScheduleRow[],
  asOf: Date = new Date()
): WorkGatingStatus {
  const overrideActive = project.escrowOverrideAt !== null;
  const overduePaymentCount = overdueSchedules.filter((row) => {
    if (row.status !== 'scheduled') return false;
    return daysOverdueUtc(row.dueDate, asOf) >= 0;
  }).length;

  let reason: WorkGatingReason = null;
  if (!overrideActive) {
    if (project.escrowHeld) {
      reason = 'escrow_held';
    } else if (overduePaymentCount > 0) {
      reason = 'overdue_payment';
    }
  }

  const blocked = reason !== null;
  const message = blocked
    ? reason === 'escrow_held'
      ? 'Work is blocked — manual escrow hold is active'
      : `Work is blocked — ${overduePaymentCount} overdue payment(s)`
    : 'Work is not blocked';

  return {
    projectId: project.id,
    blocked,
    reason,
    escrowHeld: project.escrowHeld,
    overrideActive,
    overduePaymentCount,
    message,
  };
}
