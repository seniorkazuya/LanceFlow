/** HIRE-004 — THS / RS v1 (matches documents/docs/PLANNING_SUMMARY_AND_GUIDE.md §3.3). */
export const HIRE_THS_RS_FORMULA_V1 = 'hiring-ths-rs-v1';
export const HIRE_THS_RS_RULE_KEY = 'hiring.ths_rs';

/** Auto-reject when RS is strictly greater than this threshold. */
export const HIRE_RS_AUTO_REJECT_MIN_EXCLUSIVE = 70;

export type HiringSeniority =
  | 'junior'
  | 'mid'
  | 'senior'
  | 'lead'
  | 'staff'
  | 'unknown';

export type HiringThsRsInputV1 = {
  roleApplied: string;
  yearsExperience: number;
  stack: string[];
  seniority: HiringSeniority;
  jobHopIndex: number;
  technicalScore: number | null;
};

export type HiringThsComponentsV1 = {
  ts: number;
  ei: number;
  cs: number;
  ex: number;
  pf: number;
  cf: number;
};

export type HiringRsComponentsV1 = {
  jobHop: number;
  inconsistency: number;
  contradiction: number;
  egoDominance: number;
  overconfidence: number;
};

export type HiringRecommendation = 'Reject' | 'Hold' | 'Hire' | 'Fast Track';

export type HiringThsRsResultV1 = {
  ths: number;
  rs: number;
  thsComponents: HiringThsComponentsV1;
  rsComponents: HiringRsComponentsV1;
  recommendation: HiringRecommendation;
  autoRejected: boolean;
  explanation: string[];
};

const THS_WEIGHTS = {
  ts: 0.3,
  ei: 0.2,
  cs: 0.15,
  ex: 0.1,
  pf: 0.15,
  cf: 0.1,
} as const;

const RS_WEIGHTS = {
  jobHop: 0.25,
  inconsistency: 0.25,
  contradiction: 0.2,
  egoDominance: 0.15,
  overconfidence: 0.15,
} as const;

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function seniorityBoost(seniority: HiringSeniority): number {
  switch (seniority) {
    case 'staff':
      return 15;
    case 'lead':
      return 12;
    case 'senior':
      return 10;
    case 'mid':
      return 5;
    default:
      return 0;
  }
}

function deriveThsComponents(input: HiringThsRsInputV1): HiringThsComponentsV1 {
  const stackSignal = Math.min(55, input.stack.length * 7);
  const ts =
    input.technicalScore != null
      ? input.technicalScore
      : clampScore(35 + stackSignal + seniorityBoost(input.seniority));

  return {
    ts: clampScore(ts),
    ei: 50,
    cs: 50,
    ex: clampScore(input.yearsExperience * 8),
    pf: 50,
    cf: 50,
  };
}

function deriveRsComponents(input: HiringThsRsInputV1): HiringRsComponentsV1 {
  return {
    jobHop: clampScore(input.jobHopIndex * 25),
    inconsistency: clampScore(input.jobHopIndex * 12),
    contradiction: clampScore(
      (input.technicalScore != null && input.technicalScore < 60 ? 50 : 25) +
        Math.min(45, input.jobHopIndex * 5)
    ),
    egoDominance: input.seniority === 'staff' || input.seniority === 'lead' ? 38 : 18,
    overconfidence:
      input.seniority === 'staff' ? 42 : input.seniority === 'lead' ? 32 : 16,
  };
}

function weightedThs(components: HiringThsComponentsV1): number {
  return clampScore(
    components.ts * THS_WEIGHTS.ts +
      components.ei * THS_WEIGHTS.ei +
      components.cs * THS_WEIGHTS.cs +
      components.ex * THS_WEIGHTS.ex +
      components.pf * THS_WEIGHTS.pf +
      components.cf * THS_WEIGHTS.cf
  );
}

function weightedRs(components: HiringRsComponentsV1): number {
  return clampScore(
    components.jobHop * RS_WEIGHTS.jobHop +
      components.inconsistency * RS_WEIGHTS.inconsistency +
      components.contradiction * RS_WEIGHTS.contradiction +
      components.egoDominance * RS_WEIGHTS.egoDominance +
      components.overconfidence * RS_WEIGHTS.overconfidence
  );
}

function deriveRecommendation(ths: number, rs: number): {
  recommendation: HiringRecommendation;
  autoRejected: boolean;
} {
  if (rs > HIRE_RS_AUTO_REJECT_MIN_EXCLUSIVE) {
    return { recommendation: 'Reject', autoRejected: true };
  }
  if (rs >= 50) {
    return { recommendation: 'Hold', autoRejected: false };
  }
  if (ths >= 65 && rs < 40) {
    return { recommendation: 'Fast Track', autoRejected: false };
  }
  if (ths >= 55) {
    return { recommendation: 'Hire', autoRejected: false };
  }
  return { recommendation: 'Hold', autoRejected: false };
}

export function evaluateHiringThsRsV1(input: HiringThsRsInputV1): HiringThsRsResultV1 {
  const thsComponents = deriveThsComponents(input);
  const rsComponents = deriveRsComponents(input);
  const ths = weightedThs(thsComponents);
  const rs = weightedRs(rsComponents);
  const { recommendation, autoRejected } = deriveRecommendation(ths, rs);

  return {
    ths,
    rs,
    thsComponents,
    rsComponents,
    recommendation,
    autoRejected,
    explanation: [
      `formula ${HIRE_THS_RS_FORMULA_V1}`,
      `THS=${ths} (TS=${thsComponents.ts}, EI=${thsComponents.ei}, CS=${thsComponents.cs}, EX=${thsComponents.ex}, PF=${thsComponents.pf}, CF=${thsComponents.cf})`,
      `RS=${rs} (JobHop=${rsComponents.jobHop}, Inconsistency=${rsComponents.inconsistency}, Contradiction=${rsComponents.contradiction}, Ego=${rsComponents.egoDominance}, Over=${rsComponents.overconfidence})`,
      `recommendation=${recommendation}`,
      autoRejected ? 'auto_reject=true' : 'auto_reject=false',
    ],
  };
}
