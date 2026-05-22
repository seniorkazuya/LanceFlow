import type { SubmitDailyReportInput } from './types';

export function validateSubmitDailyReportInput(
  input: SubmitDailyReportInput
): { field: string; message: string }[] {
  const errors: { field: string; message: string }[] = [];
  if (!input.projectId?.trim()) {
    errors.push({ field: 'projectId', message: 'Project is required' });
  }
  if (typeof input.hours !== 'number' || input.hours < 0 || input.hours > 24) {
    errors.push({ field: 'hours', message: 'Hours must be between 0 and 24' });
  }
  if (
    typeof input.progressPct !== 'number' ||
    input.progressPct < 0 ||
    input.progressPct > 100
  ) {
    errors.push({ field: 'progressPct', message: 'Progress must be 0–100' });
  }
  if (input.issues != null && input.issues.length > 2000) {
    errors.push({ field: 'issues', message: 'Issues text is too long' });
  }
  return errors;
}
