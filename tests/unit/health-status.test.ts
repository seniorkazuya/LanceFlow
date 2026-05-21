import { describe, expect, it } from 'vitest';
import { resolveHealthStatus } from '@lanceflow/config';

describe('resolveHealthStatus', () => {
  it('returns ok when checks are ok or skipped', () => {
    expect(resolveHealthStatus('ok', 'ok')).toBe('ok');
    expect(resolveHealthStatus('skipped', 'ok')).toBe('ok');
    expect(resolveHealthStatus('ok', 'skipped')).toBe('ok');
    expect(resolveHealthStatus('skipped', 'skipped')).toBe('ok');
  });

  it('returns degraded when any check errors', () => {
    expect(resolveHealthStatus('error', 'ok')).toBe('degraded');
    expect(resolveHealthStatus('ok', 'error')).toBe('degraded');
    expect(resolveHealthStatus('error', 'error')).toBe('degraded');
  });
});
