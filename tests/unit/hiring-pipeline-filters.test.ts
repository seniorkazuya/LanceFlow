import { describe, expect, it } from 'vitest';

import { parseHiringPipelineFilters } from '@lanceflow/hiring';

describe('parseHiringPipelineFilters (HIRE-005)', () => {
  it('parses valid stage and role filters', () => {
    expect(
      parseHiringPipelineFilters({
        status: 'scored',
        roleApplied: 'ENGINEER',
        minThs: '70',
        maxRs: '50',
      })
    ).toEqual({
      status: 'scored',
      roleApplied: 'ENGINEER',
      minThs: 70,
      maxRs: 50,
    });
  });

  it('ignores invalid values', () => {
    expect(
      parseHiringPipelineFilters({
        status: 'hired',
        roleApplied: 'CEO',
        minThs: 'abc',
        maxRs: '200',
      })
    ).toEqual({});
  });
});
