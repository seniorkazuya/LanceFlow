import type { HiringSeniority, HiringThsRsInputV1 } from '@lanceflow/rules-engine/hiring';

type ParsedResumeShape = {
  yearsExperience?: number;
  stack?: string[];
  seniority?: string;
  jobHopIndex?: number;
};

const SENIORITIES = new Set<HiringSeniority>([
  'junior',
  'mid',
  'senior',
  'lead',
  'staff',
  'unknown',
]);

function toSeniority(value: string | undefined): HiringSeniority {
  const v = (value ?? 'unknown').toLowerCase();
  return SENIORITIES.has(v as HiringSeniority) ? (v as HiringSeniority) : 'unknown';
}

export function buildThsRsInputFromApplication(row: {
  roleApplied: string;
  resumeParsed: unknown;
  technicalScore: number | null;
}): HiringThsRsInputV1 | null {
  if (!row.resumeParsed || typeof row.resumeParsed !== 'object') {
    return null;
  }

  const parsed = row.resumeParsed as ParsedResumeShape;

  return {
    roleApplied: row.roleApplied,
    yearsExperience: typeof parsed.yearsExperience === 'number' ? parsed.yearsExperience : 0,
    stack: Array.isArray(parsed.stack) ? parsed.stack.map(String) : [],
    seniority: toSeniority(parsed.seniority),
    jobHopIndex: typeof parsed.jobHopIndex === 'number' ? parsed.jobHopIndex : 0,
    technicalScore: row.technicalScore,
  };
}
