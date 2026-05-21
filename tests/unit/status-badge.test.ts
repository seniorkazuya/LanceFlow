import { describe, expect, it } from 'vitest';
import { statusToLevel } from '@lanceflow/ui';

describe('statusToLevel', () => {
  it('maps healthy states to success', () => {
    expect(statusToLevel('ok')).toBe('success');
    expect(statusToLevel('ACTIVE')).toBe('success');
  });

  it('maps warn states to warning', () => {
    expect(statusToLevel('pending')).toBe('warning');
    expect(statusToLevel('degraded')).toBe('warning');
  });

  it('maps error states to danger', () => {
    expect(statusToLevel('failed')).toBe('danger');
    expect(statusToLevel('critical')).toBe('danger');
  });

  it('falls back to neutral for unknown values', () => {
    expect(statusToLevel('unknown-status')).toBe('neutral');
  });
});
