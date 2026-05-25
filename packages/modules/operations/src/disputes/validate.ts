import {
  DISPUTE_STATUSES,
  type CreateProjectDisputeInput,
  type DisputeStatus,
  type TransitionProjectDisputeInput,
} from './types';

const ALLOWED_TRANSITIONS: Record<DisputeStatus, DisputeStatus[]> = {
  open: ['investigating', 'resolved'],
  investigating: ['escalated', 'resolved'],
  escalated: ['resolved'],
  resolved: [],
};

export function allowedDisputeTransitions(from: DisputeStatus): DisputeStatus[] {
  return ALLOWED_TRANSITIONS[from] ?? [];
}

export function validateCreateProjectDisputeInput(
  input: CreateProjectDisputeInput
): { field: string; message: string }[] {
  const errors: { field: string; message: string }[] = [];
  const title = input.title?.trim() ?? '';
  if (!title) {
    errors.push({ field: 'title', message: 'title is required' });
  } else if (title.length > 200) {
    errors.push({ field: 'title', message: 'title must be 200 characters or less' });
  }

  if (!Number.isInteger(input.amountCents) || input.amountCents <= 0) {
    errors.push({ field: 'amountCents', message: 'amountCents must be a positive integer' });
  }

  if (input.currency !== undefined && input.currency.trim().length !== 3) {
    errors.push({ field: 'currency', message: 'currency must be a 3-letter code' });
  }

  return errors;
}

export function validateTransitionProjectDisputeInput(
  from: DisputeStatus,
  input: TransitionProjectDisputeInput
): { field: string; message: string }[] {
  const errors: { field: string; message: string }[] = [];

  if (!(DISPUTE_STATUSES as readonly string[]).includes(input.status)) {
    errors.push({ field: 'status', message: 'Invalid dispute status' });
    return errors;
  }

  if (!allowedDisputeTransitions(from).includes(input.status)) {
    errors.push({
      field: 'status',
      message: `Cannot transition from ${from} to ${input.status}`,
    });
  }

  if (input.status === 'resolved' && !input.resolutionNote?.trim()) {
    errors.push({ field: 'resolutionNote', message: 'resolutionNote is required when resolving' });
  }

  return errors;
}
