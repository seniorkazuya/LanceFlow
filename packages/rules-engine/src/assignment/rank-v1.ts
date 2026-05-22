/** OPS-005 — versioned engineer ranking for project assignment. */
export const ASSIGNMENT_RANK_FORMULA_V1 = 'ops-assignment-rank-v1';

/** Penalty points per active assignment (planning: skill match − workload). */
export const WORKLOAD_PENALTY_PER_ACTIVE_V1 = 8;

export type AssignmentRankCandidateV1 = {
  userId: string;
  skillTags: readonly string[];
  activeAssignmentCount: number;
};

export type AssignmentRankInputV1 = {
  requiredSkills: readonly string[];
  candidates: readonly AssignmentRankCandidateV1[];
};

export type AssignmentRankResultV1 = {
  userId: string;
  skillMatchPct: number;
  rankScore: number;
  activeAssignmentCount: number;
};

function normalizeTags(tags: readonly string[]): string[] {
  return tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
}

/** Overlap of required skills covered by engineer tags (0–100). */
export function computeSkillMatchPct(
  requiredSkills: readonly string[],
  engineerTags: readonly string[]
): number {
  const required = normalizeTags(requiredSkills);
  if (required.length === 0) return 50;

  const tagSet = new Set(normalizeTags(engineerTags));
  const matches = required.filter((tag) => tagSet.has(tag)).length;
  return Math.round((matches / required.length) * 100);
}

/** rankScore = skillMatchPct − (activeAssignments × penalty). */
export function computeAssignmentRankScoreV1(
  skillMatchPct: number,
  activeAssignmentCount: number
): number {
  const penalty = activeAssignmentCount * WORKLOAD_PENALTY_PER_ACTIVE_V1;
  return Math.round(skillMatchPct - penalty);
}

/** Rank engineers highest score first; stable tie-break by userId. */
export function rankEngineersForAssignmentV1(
  input: AssignmentRankInputV1
): AssignmentRankResultV1[] {
  const ranked = input.candidates.map((candidate) => {
    const skillMatchPct = computeSkillMatchPct(input.requiredSkills, candidate.skillTags);
    const rankScore = computeAssignmentRankScoreV1(
      skillMatchPct,
      candidate.activeAssignmentCount
    );
    return {
      userId: candidate.userId,
      skillMatchPct,
      rankScore,
      activeAssignmentCount: candidate.activeAssignmentCount,
    };
  });

  return ranked.sort((a, b) => {
    if (b.rankScore !== a.rankScore) return b.rankScore - a.rankScore;
    return a.userId.localeCompare(b.userId);
  });
}
