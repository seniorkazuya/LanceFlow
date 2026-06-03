import { z } from 'zod';

export const COMMUNICATION_FORMULA_VERSION = 'communication-v1';

export const CommunicationScoreSourceSchema = z.enum(['llm', 'heuristic']);

export const CommunicationScoresSchema = z.object({
  grammar: z.number().int().min(0).max(100),
  clarity: z.number().int().min(0).max(100),
  persuasion: z.number().int().min(0).max(100),
  formulaVersion: z.string().min(1).max(40),
  source: CommunicationScoreSourceSchema,
  /** Optional rubric notes from LLM (not used in formulas yet). */
  notes: z.array(z.string().max(500)).max(10).optional(),
});

export type CommunicationScores = z.infer<typeof CommunicationScoresSchema>;

export function parseCommunicationScoresJson(data: unknown): CommunicationScores {
  return CommunicationScoresSchema.parse(data);
}
