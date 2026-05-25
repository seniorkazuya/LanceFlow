/** Days past due (UTC calendar days). Negative = not yet due. */
export function daysOverdueUtc(dueDate: Date, asOf: Date): number {
  const dueMs = startOfUtcDay(dueDate).getTime();
  const asOfMs = startOfUtcDay(asOf).getTime();
  return Math.round((asOfMs - dueMs) / 86_400_000);
}

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/**
 * AUTO-005 thresholds: due day → L1 reminder, +3 days → L2 escalate, +7 days → L3 risk.
 * Returns null when payment is not yet due.
 */
export function targetEscalationLevelForOverdue(daysOverdue: number): number | null {
  if (daysOverdue < 0) return null;
  if (daysOverdue >= 7) return 3;
  if (daysOverdue >= 3) return 2;
  return 1;
}

export function escalationActionForLevel(level: number): string {
  switch (level) {
    case 1:
      return 'payment_schedule.due_reminder';
    case 2:
      return 'payment_schedule.escalate_day3';
    case 3:
      return 'payment_schedule.risk_flag_day7';
    default:
      return 'payment_schedule.escalation';
  }
}
