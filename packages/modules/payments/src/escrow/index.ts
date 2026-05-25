export {
  PROGRESS_TRANSITION_TARGETS,
  evaluateWorkGatingFromData,
  isProgressTransition,
} from './gating';
export {
  applyEscrowOverride,
  assertWorkAllowedForTransition,
  getWorkGatingStatus,
  type EscrowOverrideResult,
  type WorkGatingCheckResult,
} from './service';
export type { EscrowOverrideInput, WorkGatingStatus, WorkGatingReason } from './types';
