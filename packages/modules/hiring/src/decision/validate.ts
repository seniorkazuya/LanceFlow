import { HIRING_DECISIONS, type HiringDecision } from '../types';

export type FieldError = { field: string; message: string };

const decisions = new Set<string>(HIRING_DECISIONS);

export function isHiringDecision(value: string): value is HiringDecision {
  return decisions.has(value);
}

export function validateOverrideHiringDecisionInput(input: {
  decision?: string;
  reason?: string;
}): FieldError[] {
  const errors: FieldError[] = [];
  if (!input.decision?.trim()) {
    errors.push({ field: 'decision', message: 'decision is required' });
  } else if (!isHiringDecision(input.decision.trim())) {
    errors.push({
      field: 'decision',
      message: `decision must be one of: ${HIRING_DECISIONS.join(', ')}`,
    });
  }
  if (!input.reason?.trim()) {
    errors.push({ field: 'reason', message: 'reason is required for override' });
  } else if (input.reason.trim().length < 8) {
    errors.push({ field: 'reason', message: 'reason must be at least 8 characters' });
  }
  return errors;
}
