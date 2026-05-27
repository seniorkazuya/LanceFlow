import { HIRING_APPLY_ROLES } from '../types';

import {
  HIRING_PIPELINE_STAGES,
  type HiringPipelineFilters,
  type HiringPipelineStage,
} from './types';

const applyRoles = new Set<string>(HIRING_APPLY_ROLES);
const stages = new Set<string>(HIRING_PIPELINE_STAGES);

function parseOptionalInt(value: string | undefined): number | undefined {
  if (!value?.trim()) return undefined;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : undefined;
}

/** Parse query-string filters for pipeline dashboard/API (HIRE-005). */
export function parseHiringPipelineFilters(
  params: Record<string, string | string[] | undefined>
): HiringPipelineFilters {
  const rawStatus = typeof params.status === 'string' ? params.status : undefined;
  const rawRole = typeof params.roleApplied === 'string' ? params.roleApplied : undefined;
  const minThs = parseOptionalInt(
    typeof params.minThs === 'string' ? params.minThs : undefined
  );
  const maxRs = parseOptionalInt(
    typeof params.maxRs === 'string' ? params.maxRs : undefined
  );

  const filters: HiringPipelineFilters = {};

  if (rawStatus && stages.has(rawStatus)) {
    filters.status = rawStatus as HiringPipelineStage;
  }
  if (rawRole && applyRoles.has(rawRole)) {
    filters.roleApplied = rawRole as HiringPipelineFilters['roleApplied'];
  }
  if (minThs !== undefined && minThs >= 0 && minThs <= 100) {
    filters.minThs = minThs;
  }
  if (maxRs !== undefined && maxRs >= 0 && maxRs <= 100) {
    filters.maxRs = maxRs;
  }

  return filters;
}

export function hiringPipelineWhere(filters: HiringPipelineFilters) {
  return {
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.roleApplied ? { roleApplied: filters.roleApplied } : {}),
    ...(filters.minThs !== undefined ? { thsScore: { gte: filters.minThs } } : {}),
    ...(filters.maxRs !== undefined ? { rsScore: { lte: filters.maxRs } } : {}),
  };
}
