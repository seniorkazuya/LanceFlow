import { HIRING_APPLY_ROLES } from '../types';

/** Application statuses written by hiring module flows (HIRE-001–004). */
export const HIRING_PIPELINE_STAGES = [
  'submitted',
  'parsed',
  'assessed',
  'scored',
  'rejected',
] as const;

export type HiringPipelineStage = (typeof HIRING_PIPELINE_STAGES)[number];

export type HiringPipelineFilters = {
  status?: HiringPipelineStage;
  roleApplied?: (typeof HIRING_APPLY_ROLES)[number];
  minThs?: number;
  maxRs?: number;
};

export type HiringPipelineStageCount = {
  stage: HiringPipelineStage;
  count: number;
};

export type ScoreBucket = {
  label: string;
  min: number;
  max: number;
  count: number;
};

export type HiringPipelineListItem = {
  id: string;
  fullName: string;
  roleApplied: string;
  status: string;
  technicalScore: number | null;
  thsScore: number | null;
  rsScore: number | null;
  hiringRecommendation: string | null;
  createdAt: string;
  thsRsScoredAt: string | null;
  /** Days from application to THS/RS score, when scored. */
  daysToScore: number | null;
};

export type HiringPipelineSnapshot = {
  scope: 'hiring-pipeline';
  filters: HiringPipelineFilters;
  stageCounts: HiringPipelineStageCount[];
  thsDistribution: ScoreBucket[];
  rsDistribution: ScoreBucket[];
  timeToHire: {
    /** Applications with a THS/RS score timestamp. */
    scoredCount: number;
    /** Mean days from apply to score. */
    averageDays: number | null;
  };
  applications: HiringPipelineListItem[];
  generatedAt: string;
};
