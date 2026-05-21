import { describe, expect, it } from 'vitest';
import { validateDevCredentials } from '@lanceflow/auth';

describe('validateDevCredentials', () => {
  const config = { email: 'ops@lanceflow.test', password: 'secret' };

  it('accepts matching email and password', () => {
    expect(validateDevCredentials('ops@lanceflow.test', 'secret', config)).toBe(true);
  });

  it('rejects wrong password', () => {
    expect(validateDevCredentials('ops@lanceflow.test', 'wrong', config)).toBe(false);
  });

  it('rejects wrong email', () => {
    expect(validateDevCredentials('other@test', 'secret', config)).toBe(false);
  });
});
