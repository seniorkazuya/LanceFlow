const DEFAULT_MAX_LLM_CALLS = 1;

export function getCommunicationLlmMaxCallsPerCandidate(): number {
  const raw = process.env.HIRING_COMMUNICATION_LLM_MAX_CALLS?.trim();
  if (!raw) return DEFAULT_MAX_LLM_CALLS;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 0) return DEFAULT_MAX_LLM_CALLS;
  return parsed;
}

export function canInvokeCommunicationLlm(currentCalls: number): boolean {
  return currentCalls < getCommunicationLlmMaxCallsPerCandidate();
}
