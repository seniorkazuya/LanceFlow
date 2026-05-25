/** Clamp sub-scores to 0–100 for KPI formulas (KPI-001). */
export function clampKpiComponent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

/** Weighted sum of components; weights must sum to 1. */
export function weightedKpiScore(
  components: { value: number; weight: number }[]
): number {
  const totalWeight = components.reduce((s, c) => s + c.weight, 0);
  if (totalWeight === 0) return 0;
  const raw = components.reduce((s, c) => s + clampKpiComponent(c.value) * c.weight, 0);
  return Math.round(raw / totalWeight);
}
