import { afterEach, describe, expect, it } from 'vitest';

import { isAutoAssignEnabled } from '@lanceflow/config';

describe('isAutoAssignEnabled (AUTO-003)', () => {
  const previous = process.env.AUTO_ASSIGN_ENABLED;

  afterEach(() => {
    if (previous === undefined) {
      delete process.env.AUTO_ASSIGN_ENABLED;
    } else {
      process.env.AUTO_ASSIGN_ENABLED = previous;
    }
  });

  it('is false when unset', () => {
    delete process.env.AUTO_ASSIGN_ENABLED;
    expect(isAutoAssignEnabled()).toBe(false);
  });

  it('is true for true/1/yes', () => {
    process.env.AUTO_ASSIGN_ENABLED = 'true';
    expect(isAutoAssignEnabled()).toBe(true);
    process.env.AUTO_ASSIGN_ENABLED = '1';
    expect(isAutoAssignEnabled()).toBe(true);
    process.env.AUTO_ASSIGN_ENABLED = 'yes';
    expect(isAutoAssignEnabled()).toBe(true);
  });
});
