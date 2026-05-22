/** Active assignment = not released (OPS-004 workload definition). */
export function isActiveAssignment(releasedAt: Date | null): boolean {
  return releasedAt === null;
}

export function countActiveAssignments(
  rows: readonly { releasedAt: Date | null }[]
): number {
  return rows.filter((row) => isActiveAssignment(row.releasedAt)).length;
}
