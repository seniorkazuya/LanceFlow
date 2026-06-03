import { canInvokeCommunicationLlm, getCommunicationLlmMaxCallsPerCandidate } from './cost-cap';
import { scoreCommunicationHeuristic } from './heuristic';
import { isLlmCommunicationAnalysisEnabled, scoreCommunicationWithLlm } from './llm';
import type { CommunicationScores } from './schema';

export {
  COMMUNICATION_FORMULA_VERSION,
  CommunicationScoresSchema,
  CommunicationScoreSourceSchema,
  parseCommunicationScoresJson,
  type CommunicationScores,
} from './schema';
export { scoreCommunicationHeuristic } from './heuristic';
export {
  canInvokeCommunicationLlm,
  getCommunicationLlmMaxCallsPerCandidate,
} from './cost-cap';
export { isLlmCommunicationAnalysisEnabled, scoreCommunicationWithLlm };

export type ScoreCommunicationTextOptions = {
  currentLlmCalls: number;
};

export type ScoreCommunicationTextResult = CommunicationScores & {
  llmInvoked: boolean;
  costCapReached: boolean;
};

/** Score written communication; respects per-candidate LLM cost cap (AI-001). */
export async function scoreCommunicationText(
  text: string,
  options: ScoreCommunicationTextOptions
): Promise<ScoreCommunicationTextResult> {
  const costCapReached =
    isLlmCommunicationAnalysisEnabled() && !canInvokeCommunicationLlm(options.currentLlmCalls);

  if (isLlmCommunicationAnalysisEnabled() && !costCapReached) {
    const scored = await scoreCommunicationWithLlm(text);
    return {
      ...scored,
      llmInvoked: scored.source === 'llm',
      costCapReached: false,
    };
  }

  const scored = scoreCommunicationHeuristic(text);
  return {
    ...scored,
    llmInvoked: false,
    costCapReached,
  };
}
