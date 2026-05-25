import type { KpiRoleSummary } from './types';

type KpiRow = { role: string; score: number };

export function aggregateKpiByRole(rows: KpiRow[]): KpiRoleSummary[] {
  const byRole = new Map<string, number[]>();

  for (const row of rows) {
    const scores = byRole.get(row.role) ?? [];
    scores.push(row.score);
    byRole.set(row.role, scores);
  }

  return [...byRole.entries()]
    .map(([role, scores]) => {
      const sum = scores.reduce((a, b) => a + b, 0);
      return {
        role,
        count: scores.length,
        avgScore: Math.round(sum / scores.length),
        minScore: Math.min(...scores),
        maxScore: Math.max(...scores),
      };
    })
    .sort((a, b) => a.role.localeCompare(b.role));
}
