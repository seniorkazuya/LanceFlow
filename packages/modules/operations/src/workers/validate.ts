const MAX_TAGS = 24;
const MAX_TAG_LENGTH = 48;
const TAG_PATTERN = /^[a-z0-9][a-z0-9+_.-]*$/;

export function normalizeSkillTags(raw: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of raw) {
    const tag = item.trim().toLowerCase();
    if (!tag || seen.has(tag)) continue;
    seen.add(tag);
    out.push(tag);
  }
  return out.slice(0, MAX_TAGS);
}

export function validateSkillTags(
  raw: unknown
): { field: string; message: string }[] {
  if (!Array.isArray(raw)) {
    return [{ field: 'skillTags', message: 'skillTags must be an array' }];
  }
  const errors: { field: string; message: string }[] = [];
  if (raw.length > MAX_TAGS) {
    errors.push({ field: 'skillTags', message: `At most ${MAX_TAGS} tags allowed` });
  }
  for (let i = 0; i < raw.length; i++) {
    const value = raw[i];
    if (typeof value !== 'string') {
      errors.push({ field: 'skillTags', message: `Tag at index ${i} must be a string` });
      continue;
    }
    const tag = value.trim().toLowerCase();
    if (!tag) {
      errors.push({ field: 'skillTags', message: 'Tags cannot be empty' });
      continue;
    }
    if (tag.length > MAX_TAG_LENGTH) {
      errors.push({
        field: 'skillTags',
        message: `Tag "${tag.slice(0, 12)}…" exceeds ${MAX_TAG_LENGTH} characters`,
      });
    }
    if (!TAG_PATTERN.test(tag)) {
      errors.push({
        field: 'skillTags',
        message: `Tag "${tag}" must be lowercase alphanumeric with + _ . -`,
      });
    }
  }
  return errors;
}

export function validateUpdateWorkerSkillsInput(
  input: { skillTags?: unknown }
): { field: string; message: string }[] {
  if (input.skillTags === undefined) {
    return [{ field: 'skillTags', message: 'skillTags is required' }];
  }
  return validateSkillTags(input.skillTags);
}
