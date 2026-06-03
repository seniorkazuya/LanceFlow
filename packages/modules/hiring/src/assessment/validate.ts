export function validateTechnicalScore(
  score: unknown
): { field: string; message: string }[] {
  if (score === undefined || score === null || score === '') {
    return [{ field: 'technicalScore', message: 'Technical score is required' }];
  }
  const n = typeof score === 'number' ? score : Number(score);
  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    return [{ field: 'technicalScore', message: 'Technical score must be a whole number' }];
  }
  if (n < 0 || n > 100) {
    return [{ field: 'technicalScore', message: 'Technical score must be between 0 and 100' }];
  }
  return [];
}
