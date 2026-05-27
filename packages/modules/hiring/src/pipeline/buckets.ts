import type { ScoreBucket } from './types';

const THS_BUCKETS: Omit<ScoreBucket, 'count'>[] = [
  { label: '0–49', min: 0, max: 49 },
  { label: '50–69', min: 50, max: 69 },
  { label: '70–84', min: 70, max: 84 },
  { label: '85–100', min: 85, max: 100 },
];

const RS_BUCKETS: Omit<ScoreBucket, 'count'>[] = [
  { label: '0–30', min: 0, max: 30 },
  { label: '31–50', min: 31, max: 50 },
  { label: '51–70', min: 51, max: 70 },
  { label: '71–100', min: 71, max: 100 },
];

function bucketCount(scores: number[], min: number, max: number): number {
  return scores.filter((s) => s >= min && s <= max).length;
}

export function buildThsDistribution(scores: number[]): ScoreBucket[] {
  return THS_BUCKETS.map((b) => ({ ...b, count: bucketCount(scores, b.min, b.max) }));
}

export function buildRsDistribution(scores: number[]): ScoreBucket[] {
  return RS_BUCKETS.map((b) => ({ ...b, count: bucketCount(scores, b.min, b.max) }));
}

const MS_PER_DAY = 86_400_000;

/** Whole days from application created to THS/RS scored. */
export function daysBetween(createdAt: Date, scoredAt: Date): number {
  const diff = scoredAt.getTime() - createdAt.getTime();
  return Math.max(0, Math.round(diff / MS_PER_DAY));
}

export function averageDaysToScore(pairs: { createdAt: Date; scoredAt: Date }[]): number | null {
  if (pairs.length === 0) return null;
  const total = pairs.reduce((sum, p) => sum + daysBetween(p.createdAt, p.scoredAt), 0);
  return Math.round((total / pairs.length) * 10) / 10;
}
