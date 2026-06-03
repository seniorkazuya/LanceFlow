import { RESUME_PARSE_FORMULA_VERSION, type ParsedResume } from '../schema';

const STACK_KEYWORDS = [
  'javascript',
  'typescript',
  'python',
  'java',
  'go',
  'golang',
  'rust',
  'react',
  'next.js',
  'nextjs',
  'node',
  'nodejs',
  'postgresql',
  'postgres',
  'mysql',
  'redis',
  'aws',
  'docker',
  'kubernetes',
  'graphql',
  'vue',
  'angular',
  'csharp',
  'c#',
  '.net',
  'php',
  'ruby',
  'rails',
  'swift',
  'kotlin',
  'flutter',
  'terraform',
  'linux',
] as const;

const SENIORITY_RANK: Record<ParsedResume['seniority'], number> = {
  junior: 1,
  mid: 2,
  senior: 3,
  lead: 4,
  staff: 5,
  unknown: 0,
};

function detectSeniority(text: string): ParsedResume['seniority'] {
  const lower = text.toLowerCase();
  const hits: ParsedResume['seniority'][] = [];
  if (/\b(staff|principal|distinguished)\b/.test(lower)) hits.push('staff');
  if (/\b(lead|manager|head of)\b/.test(lower)) hits.push('lead');
  if (/\b(senior|sr\.?)\b/.test(lower)) hits.push('senior');
  if (/\b(junior|jr\.?|entry)\b/.test(lower)) hits.push('junior');
  if (/\b(mid|intermediate)\b/.test(lower)) hits.push('mid');
  if (hits.length === 0) return 'unknown';
  return hits.sort((a, b) => SENIORITY_RANK[b] - SENIORITY_RANK[a])[0]!;
}

function detectYears(text: string): number {
  const explicit = text.match(/(\d{1,2})\+?\s*years?\s+(?:of\s+)?experience/i);
  if (explicit) {
    return Math.min(60, parseInt(explicit[1]!, 10));
  }

  const ranges =
    text.match(/\b(19|20)\d{2}\s*[-–—]\s*((19|20)\d{2}|present|current)\b/gi) ?? [];
  if (ranges.length === 0) return 0;

  const years = new Set<number>();
  for (const range of ranges) {
    const startYear = parseInt(range.slice(0, 4), 10);
    years.add(startYear);
  }
  const earliest = Math.min(...years);
  const span = new Date().getFullYear() - earliest;
  return Math.min(60, Math.max(0, span));
}

function detectJobHopIndex(text: string): number {
  const ranges =
    text.match(/\b(19|20)\d{2}\s*[-–—]\s*((19|20)\d{2}|present|current)\b/gi) ?? [];
  if (ranges.length > 0) {
    return Math.min(50, ranges.length);
  }
  const atCompany = text.match(/\bat\s+[A-Z][A-Za-z0-9&.,'\-\s]{2,40}/g) ?? [];
  return Math.min(50, atCompany.length);
}

function detectStack(text: string): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();
  for (const keyword of STACK_KEYWORDS) {
    const pattern =
      keyword === 'c#'
        ? /\bc\s*#\b/i
        : keyword === '.net'
          ? /\b\.net\b/i
          : new RegExp(`\\b${keyword.replace('.', '\\.')}\\b`, 'i');
    if (pattern.test(lower)) {
      found.add(keyword === 'nodejs' ? 'node' : keyword);
    }
  }
  return [...found].slice(0, 40);
}

/** Deterministic resume parser for CI fixtures and LLM fallback (HIRE-002). */
export function parseResumeHeuristic(text: string): ParsedResume {
  const normalized = text.replace(/\s+/g, ' ').trim();
  return {
    yearsExperience: detectYears(normalized),
    stack: detectStack(normalized),
    seniority: detectSeniority(normalized),
    jobHopIndex: detectJobHopIndex(normalized),
    formulaVersion: RESUME_PARSE_FORMULA_VERSION,
  };
}
