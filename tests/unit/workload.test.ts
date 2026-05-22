import { describe, expect, it } from 'vitest';
import { countActiveAssignments, isActiveAssignment } from '@lanceflow/operations';

describe('isActiveAssignment', () => {
  it('treats null releasedAt as active', () => {
    expect(isActiveAssignment(null)).toBe(true);
  });

  it('treats released assignments as inactive', () => {
    expect(isActiveAssignment(new Date())).toBe(false);
  });
});

describe('countActiveAssignments', () => {
  it('counts only unreleased rows', () => {
    const count = countActiveAssignments([
      { releasedAt: null },
      { releasedAt: new Date() },
      { releasedAt: null },
    ]);
    expect(count).toBe(2);
  });
});
