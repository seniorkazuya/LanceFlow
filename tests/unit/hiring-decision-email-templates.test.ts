import { buildCandidateDecisionEmail } from '@lanceflow/hiring';
import { describe, expect, it } from 'vitest';

describe('hiring decision email templates (HIRE-008)', () => {
  const base = { fullName: 'Alex Rivera', roleApplied: 'ENGINEER' };

  it('builds reject template', () => {
    const email = buildCandidateDecisionEmail({ ...base, decision: 'Reject' });
    expect(email.subject).toMatch(/update/i);
    expect(email.text).toContain('Alex Rivera');
    expect(email.text).toMatch(/not be moving forward/i);
    expect(email.html).toContain('engineer');
  });

  it('builds hold template', () => {
    const email = buildCandidateDecisionEmail({ ...base, decision: 'Hold' });
    expect(email.subject).toMatch(/hold/i);
    expect(email.text).toMatch(/under review/i);
  });

  it('builds hire template', () => {
    const email = buildCandidateDecisionEmail({ ...base, decision: 'Hire' });
    expect(email.subject).toMatch(/next steps/i);
    expect(email.text).toMatch(/move forward/i);
  });

  it('builds fast track variant', () => {
    const email = buildCandidateDecisionEmail({ ...base, decision: 'Fast Track' });
    expect(email.subject).toMatch(/fast track/i);
    expect(email.text).toMatch(/fast-track/i);
  });
});
