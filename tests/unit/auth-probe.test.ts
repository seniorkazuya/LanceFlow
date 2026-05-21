import { describe, expect, it } from 'vitest';
import { validateDevCredentials } from '@lanceflow/auth';

describe('sign-in credential probe (unit)', () => {
  it('rejects mismatching password', () => {
    const config = { email: 'ops@lanceflow.test', password: 'secret-on-server' };
    expect(validateDevCredentials('ops@lanceflow.test', 'wrong', config)).toBe(false);
  });

  it('accepts exact match after trim', () => {
    const config = { email: 'ops@lanceflow.test', password: 'secret' };
    expect(validateDevCredentials('  ops@lanceflow.test ', ' secret ', config)).toBe(true);
  });
});
