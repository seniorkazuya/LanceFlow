import type { ProjectStatus } from './types';

/** Manual transitions only (OPS-003). */
const ALLOWED: Record<ProjectStatus, readonly ProjectStatus[]> = {
  draft: ['pending_approval'],
  pending_approval: ['draft', 'active'],
  active: ['delivered'],
  delivered: ['closed'],
  closed: [],
};

export function canTransition(from: ProjectStatus, to: ProjectStatus): boolean {
  return ALLOWED[from].includes(to);
}

export function allowedTransitionsFrom(from: ProjectStatus): readonly ProjectStatus[] {
  return ALLOWED[from];
}
