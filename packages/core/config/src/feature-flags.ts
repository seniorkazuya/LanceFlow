/** AUTO-003 — auto-assign top-ranked engineer when a project becomes active. */
export function isAutoAssignEnabled(): boolean {
  const raw = process.env.AUTO_ASSIGN_ENABLED?.trim().toLowerCase();
  return raw === '1' || raw === 'true' || raw === 'yes';
}
