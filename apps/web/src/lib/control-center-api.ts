import type { ControlCenterSummary } from '@lanceflow/analytics';

/** JSON-safe Control Center summary for BFF routes (KPI-003). */
export function serializeControlCenterSummary(summary: ControlCenterSummary) {
  return summary;
}
