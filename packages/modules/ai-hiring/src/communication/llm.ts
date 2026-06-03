import { isLlmResumeParseEnabled } from '../parser/llm';
import {
  COMMUNICATION_FORMULA_VERSION,
  parseCommunicationScoresJson,
  type CommunicationScores,
} from './schema';
import { scoreCommunicationHeuristic } from './heuristic';

const PROMPT_VERSION = 'hire-communication-v1';

export function isLlmCommunicationAnalysisEnabled(): boolean {
  return isLlmResumeParseEnabled();
}

/** Score grammar, clarity, persuasion via LLM rubric; heuristic on failure. */
export async function scoreCommunicationWithLlm(text: string): Promise<CommunicationScores> {
  const apiKey = process.env.LLM_API_KEY?.trim();
  if (!apiKey) {
    return scoreCommunicationHeuristic(text);
  }

  const baseUrl = (process.env.LLM_API_BASE_URL?.trim() || 'https://api.openai.com/v1').replace(
    /\/$/,
    ''
  );
  const model =
    process.env.LLM_COMMUNICATION_MODEL?.trim() ||
    process.env.LLM_RESUME_MODEL?.trim() ||
    'gpt-4o-mini';

  const system = [
    'You are an HR communication analyst scoring written samples from hiring resumes.',
    'Score each dimension 0-100 (integer): grammar (mechanics, tense, agreement),',
    'clarity (structure, readability, concise phrasing), persuasion (impact, metrics, ownership language).',
    'Return JSON only with keys: grammar, clarity, persuasion (numbers), notes (string[] optional, max 5 short bullets).',
    `Set formulaVersion to "${COMMUNICATION_FORMULA_VERSION}" and source to "llm".`,
  ].join(' ');

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: system },
          {
            role: 'user',
            content: `Written sample (${PROMPT_VERSION}):\n\n${text.slice(0, 12_000)}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      return scoreCommunicationHeuristic(text);
    }

    const payload = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) {
      return scoreCommunicationHeuristic(text);
    }

    const raw = JSON.parse(content) as unknown;
    const parsed = parseCommunicationScoresJson({
      ...(typeof raw === 'object' && raw !== null ? raw : {}),
      formulaVersion: COMMUNICATION_FORMULA_VERSION,
      source: 'llm',
    });
    return parsed;
  } catch {
    return scoreCommunicationHeuristic(text);
  }
}
