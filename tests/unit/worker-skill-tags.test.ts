import { describe, expect, it } from 'vitest';
import { normalizeSkillTags, validateSkillTags } from '@lanceflow/operations';

describe('normalizeSkillTags', () => {
  it('trims, lowercases, and dedupes', () => {
    expect(normalizeSkillTags([' React ', 'react', 'NODE'])).toEqual(['react', 'node']);
  });
});

describe('validateSkillTags', () => {
  it('rejects non-array input', () => {
    expect(validateSkillTags('react')).toHaveLength(1);
  });

  it('rejects invalid tag characters', () => {
    const errors = validateSkillTags(['bad tag']);
    expect(errors.some((e) => e.field === 'skillTags')).toBe(true);
  });

  it('accepts valid tags', () => {
    expect(validateSkillTags(['react', 'node.js'])).toEqual([]);
  });
});
