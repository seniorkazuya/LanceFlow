import { describe, expect, it } from 'vitest';
import {
  MAX_RESUME_BYTES,
  parseHiringApplyRole,
  validateSubmitApplicationInput,
} from '@lanceflow/hiring';

describe('parseHiringApplyRole', () => {
  it('accepts valid roles case-insensitively', () => {
    expect(parseHiringApplyRole('engineer')).toBe('ENGINEER');
    expect(parseHiringApplyRole('BIDDER')).toBe('BIDDER');
  });

  it('rejects invalid roles', () => {
    expect(parseHiringApplyRole('CEO')).toBeNull();
    expect(parseHiringApplyRole('')).toBeNull();
  });
});

describe('validateSubmitApplicationInput', () => {
  const base = {
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    roleApplied: 'ENGINEER' as const,
    consentGiven: true,
    resumeFileName: 'resume.pdf',
    resumeMimeType: 'application/pdf',
    resumeSizeBytes: 1024,
  };

  it('accepts valid input', () => {
    expect(validateSubmitApplicationInput(base)).toEqual([]);
  });

  it('requires consent', () => {
    const errors = validateSubmitApplicationInput({ ...base, consentGiven: false });
    expect(errors[0]?.field).toBe('consentGiven');
  });

  it('rejects oversize resume', () => {
    const errors = validateSubmitApplicationInput({
      ...base,
      resumeSizeBytes: MAX_RESUME_BYTES + 1,
    });
    expect(errors[0]?.field).toBe('resume');
  });

  it('rejects invalid mime type', () => {
    const errors = validateSubmitApplicationInput({
      ...base,
      resumeMimeType: 'text/plain',
    });
    expect(errors[0]?.field).toBe('resume');
  });
});
