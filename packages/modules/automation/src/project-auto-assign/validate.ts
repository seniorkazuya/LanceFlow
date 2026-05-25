export function validateOverrideAutoAssignInput(input: {
  userId?: string;
  reason?: string;
}): { field: string; message: string }[] {
  const errors: { field: string; message: string }[] = [];
  if (!input.userId?.trim()) {
    errors.push({ field: 'userId', message: 'userId is required' });
  }
  const reason = input.reason?.trim() ?? '';
  if (!reason) {
    errors.push({ field: 'reason', message: 'reason is required for override' });
  } else if (reason.length < 8) {
    errors.push({ field: 'reason', message: 'reason must be at least 8 characters' });
  }
  return errors;
}
