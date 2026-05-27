import { prisma } from '@lanceflow/database';

import type { HiringApplicationRecord } from './types';

function toRecord(row: {
  id: string;
  fullName: string;
  email: string;
  roleApplied: string;
  resumeStorageKey: string;
  resumeFileName: string;
  resumeMimeType: string | null;
  resumeSizeBytes: number;
  consentGiven: boolean;
  consentAt: Date;
  status: string;
  technicalScore: number | null;
  technicalScoreAt: Date | null;
  technicalScoreSource: string | null;
  thsScore: number | null;
  rsScore: number | null;
  hiringRecommendation: string | null;
  thsRsFormulaVersion: string | null;
  thsRsScoredAt: Date | null;
  createdAt: Date;
}): HiringApplicationRecord {
  return {
    id: row.id,
    fullName: row.fullName,
    email: row.email,
    roleApplied: row.roleApplied,
    resumeStorageKey: row.resumeStorageKey,
    resumeFileName: row.resumeFileName,
    resumeMimeType: row.resumeMimeType,
    resumeSizeBytes: row.resumeSizeBytes,
    consentGiven: row.consentGiven,
    consentAt: row.consentAt,
    status: row.status,
    technicalScore: row.technicalScore,
    technicalScoreAt: row.technicalScoreAt,
    technicalScoreSource: row.technicalScoreSource,
    thsScore: row.thsScore,
    rsScore: row.rsScore,
    hiringRecommendation: row.hiringRecommendation,
    thsRsFormulaVersion: row.thsRsFormulaVersion,
    thsRsScoredAt: row.thsRsScoredAt,
    createdAt: row.createdAt,
  };
}

export async function getHiringApplicationById(
  id: string
): Promise<HiringApplicationRecord | null> {
  const row = await prisma.hiringApplication.findUnique({ where: { id } });
  return row ? toRecord(row) : null;
}
