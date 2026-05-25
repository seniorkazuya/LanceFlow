import { parseParsedResumeJson, RESUME_PARSE_FORMULA_VERSION } from '../schema';
import { parseResumeHeuristic } from './heuristic';

const PROMPT_VERSION = 'hire-resume-parse-v1';

export function isLlmResumeParseEnabled(): boolean {
  return Boolean(process.env.LLM_API_KEY?.trim());
}

/** Parse resume text via OpenAI-compatible chat API; falls back to heuristic on failure. */
export async function parseResumeWithLlm(text: string): Promise<ReturnType<typeof parseParsedResumeJson>> {
  const apiKey = process.env.LLM_API_KEY?.trim();
  if (!apiKey) {
    return parseResumeHeuristic(text);
  }

  const baseUrl = (process.env.LLM_API_BASE_URL?.trim() || 'https://api.openai.com/v1').replace(
    /\/$/,
    ''
  );
  const model = process.env.LLM_RESUME_MODEL?.trim() || 'gpt-4o-mini';

  const system = [
    'You extract structured hiring fields from resume text.',
    'Return JSON only with keys: yearsExperience (number), stack (string[]), seniority (junior|mid|senior|lead|staff|unknown), jobHopIndex (number, count of distinct jobs).',
    `Set formulaVersion to "${RESUME_PARSE_FORMULA_VERSION}".`,
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
            content: `Resume text (${PROMPT_VERSION}):\n\n${text.slice(0, 12_000)}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      return parseResumeHeuristic(text);
    }

    const payload = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) {
      return parseResumeHeuristic(text);
    }

    const raw = JSON.parse(content) as unknown;
    return parseParsedResumeJson(raw);
  } catch {
    return parseResumeHeuristic(text);
  }
}
