import { describe, expect, it } from 'vitest';
import { validateTechnicalScore } from '@lanceflow/hiring';

describe('validateTechnicalScore (HIRE-003)', () => {
  it('accepts 0 and 100', () => {
    expect(validateTechnicalScore(0)).toEqual([]);
    expect(validateTechnicalScore(100)).toEqual([]);
  });

  it('rejects out of range and non-integers', () => {
    expect(validateTechnicalScore(101)[0]?.field).toBe('technicalScore');
    expect(validateTechnicalScore(-1)[0]?.field).toBe('technicalScore');
    expect(validateTechnicalScore(72.5)[0]?.field).toBe('technicalScore');
    expect(validateTechnicalScore('')[0]?.field).toBe('technicalScore');
  });
});
