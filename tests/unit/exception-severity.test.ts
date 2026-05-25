import { describe, expect, it } from 'vitest';

import { EXCEPTION_SEVERITIES } from '@lanceflow/automation';

/** Severity palette matches StatusBadge (AUTO-008). */
describe('exception severity (AUTO-008)', () => {
  it('uses danger, warning, success for red/yellow/green', () => {
    expect(EXCEPTION_SEVERITIES).toEqual(['danger', 'warning', 'success']);
  });
});
