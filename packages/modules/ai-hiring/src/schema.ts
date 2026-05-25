import { z } from 'zod';

export const RESUME_PARSE_FORMULA_VERSION = 'resume-parse-v1';

export const ResumeSenioritySchema = z.enum([
  'junior',
  'mid',
  'senior',
  'lead',
  'staff',
  'unknown',
]);

export const ParsedResumeSchema = z.object({
  yearsExperience: z.number().min(0).max(60),
  stack: z.array(z.string().min(1).max(80)).max(40),
  seniority: ResumeSenioritySchema,
  /** Approximate job changes (employment stints) detected in resume text. */
  jobHopIndex: z.number().min(0).max(50),
  formulaVersion: z.string().min(1).max(40),
});

export type ParsedResume = z.infer<typeof ParsedResumeSchema>;

export function parseParsedResumeJson(data: unknown): ParsedResume {
  return ParsedResumeSchema.parse(data);
}
