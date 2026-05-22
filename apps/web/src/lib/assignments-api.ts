import type { AssignmentRecord, AssignmentSuggestion } from '@lanceflow/operations';

export function serializeAssignment(assignment: AssignmentRecord) {
  return {
    ...assignment,
    assignedAt: assignment.assignedAt.toISOString(),
    releasedAt: assignment.releasedAt?.toISOString() ?? null,
  };
}

export function serializeSuggestion(suggestion: AssignmentSuggestion) {
  return suggestion;
}
