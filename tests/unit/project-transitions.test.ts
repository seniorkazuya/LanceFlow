import { describe, expect, it } from 'vitest';
import { canTransition } from '@lanceflow/operations';

describe('canTransition', () => {
  it('allows draft to pending_approval', () => {
    expect(canTransition('draft', 'pending_approval')).toBe(true);
  });

  it('allows pending_approval to active', () => {
    expect(canTransition('pending_approval', 'active')).toBe(true);
  });

  it('blocks draft to active', () => {
    expect(canTransition('draft', 'active')).toBe(false);
  });

  it('blocks transitions from closed', () => {
    expect(canTransition('closed', 'active')).toBe(false);
  });
});
