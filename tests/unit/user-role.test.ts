import { describe, expect, it } from 'vitest';
import { UserRole } from '@lanceflow/types';

describe('UserRole', () => {
  it('defines all roles', () => {
    expect(Object.values(UserRole)).toEqual([
      'CEO',
      'OPS_MANAGER',
      'CALLER',
      'BIDDER',
      'ENGINEER',
      'CLIENT',
      'DEVELOPER',
    ]);
  });
});
