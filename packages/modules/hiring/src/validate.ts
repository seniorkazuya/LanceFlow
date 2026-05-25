import {
  ALLOWED_RESUME_MIME_TYPES,
  HIRING_APPLY_ROLES,
  MAX_RESUME_BYTES,
  type HiringApplyRole,
  type SubmitApplicationInput,
} from './types';

export function validateSubmitApplicationInput(
  input: Omit<SubmitApplicationInput, 'resumeBytes'> & { resumeSizeBytes: number }
): { field: string; message: string }[] {
  const errors: { field: string; message: string }[] = [];

  const name = input.fullName?.trim() ?? '';
  if (!name) {
    errors.push({ field: 'fullName', message: 'Full name is required' });
  } else if (name.length > 120) {
    errors.push({ field: 'fullName', message: 'Full name must be 120 characters or less' });
  }

  const email = input.email?.trim() ?? '';
  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: 'email', message: 'Email must be valid' });
  }

  if (!(HIRING_APPLY_ROLES as readonly string[]).includes(input.roleApplied)) {
    errors.push({ field: 'roleApplied', message: 'Invalid role' });
  }

  if (!input.consentGiven) {
    errors.push({ field: 'consentGiven', message: 'Consent is required to apply' });
  }

  if (!input.resumeFileName?.trim()) {
    errors.push({ field: 'resume', message: 'Resume file is required' });
  }

  if (!ALLOWED_RESUME_MIME_TYPES.has(input.resumeMimeType)) {
    errors.push({ field: 'resume', message: 'Resume must be PDF or Word document' });
  }

  if (input.resumeSizeBytes <= 0) {
    errors.push({ field: 'resume', message: 'Resume file is empty' });
  } else if (input.resumeSizeBytes > MAX_RESUME_BYTES) {
    errors.push({
      field: 'resume',
      message: `Resume must be ${MAX_RESUME_BYTES / (1024 * 1024)}MB or less`,
    });
  }

  return errors;
}

export function parseHiringApplyRole(value: string): HiringApplyRole | null {
  const v = value.trim().toUpperCase();
  return (HIRING_APPLY_ROLES as readonly string[]).includes(v) ? (v as HiringApplyRole) : null;
}
