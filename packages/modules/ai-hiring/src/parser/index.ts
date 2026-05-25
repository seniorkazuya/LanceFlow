import { isLlmResumeParseEnabled, parseResumeWithLlm } from './llm';
import { parseResumeHeuristic } from './heuristic';
import type { ParsedResume } from '../schema';

export { parseResumeHeuristic, parseResumeWithLlm, isLlmResumeParseEnabled };

/** Parse resume text using LLM when configured, otherwise heuristic. */
export async function parseResumeText(text: string): Promise<ParsedResume> {
  if (isLlmResumeParseEnabled()) {
    return parseResumeWithLlm(text);
  }
  return parseResumeHeuristic(text);
}
