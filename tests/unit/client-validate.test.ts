import { describe, expect, it } from 'vitest';
import {
  validateCreateClientInput,
  validateOverrideClientRiskInput,
  validateUpdateClientInput,
} from '@lanceflow/operations';

describe('validateCreateClientInput', () => {
  it('requires name', () => {
    expect(validateCreateClientInput({ name: '' })).toHaveLength(1);
    expect(validateCreateClientInput({ name: '  ' })[0]?.field).toBe('name');
  });

  it('accepts valid input', () => {
    expect(validateCreateClientInput({ name: 'Acme Corp', riskScore: 25 })).toEqual([]);
  });

  it('rejects invalid risk score', () => {
    const errors = validateCreateClientInput({ name: 'Acme', riskScore: 101 });
    expect(errors[0]?.field).toBe('riskScore');
  });
});

describe('validateUpdateClientInput', () => {
  it('rejects invalid status', () => {
    const errors = validateUpdateClientInput({ status: 'deleted' as 'active' });
    expect(errors[0]?.field).toBe('status');
  });
});

describe('validateOverrideClientRiskInput', () => {
  it('requires reason', () => {
    expect(validateOverrideClientRiskInput({ riskScore: 50, reason: '' })).toHaveLength(1);
  });
});
