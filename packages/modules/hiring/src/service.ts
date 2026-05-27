import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';

import { storeResume } from './storage';
import type { HiringApplicationRecord, SubmitApplicationInput } from './types';
import { validateSubmitApplicationInput } from './validate';

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

export type SubmitApplicationResult =
  | { ok: true; application: HiringApplicationRecord }
  | { ok: false; errors: { field: string; message: string }[] };

/** HIRE-001 — submit candidate application with resume upload. */
export async function submitHiringApplication(
  input: SubmitApplicationInput,
  actorId: string = 'public:hiring-apply'
): Promise<SubmitApplicationResult> {
  const errors = validateSubmitApplicationInput({
    ...input,
    resumeSizeBytes: input.resumeBytes.length,
  });
  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const applicationId = crypto.randomUUID();
  let resumeStorageKey: string;
  try {
    resumeStorageKey = await storeResume({
      applicationId,
      fileName: input.resumeFileName,
      mimeType: input.resumeMimeType,
      body: input.resumeBytes,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Resume upload failed';
    return { ok: false, errors: [{ field: 'resume', message }] };
  }

  const now = new Date();
  const row = await prisma.hiringApplication.create({
    data: {
      id: applicationId,
      fullName: input.fullName.trim(),
      email: input.email.trim().toLowerCase(),
      roleApplied: input.roleApplied,
      resumeStorageKey,
      resumeFileName: input.resumeFileName.trim(),
      resumeMimeType: input.resumeMimeType,
      resumeSizeBytes: input.resumeBytes.length,
      consentGiven: true,
      consentAt: now,
      status: 'submitted',
      technicalScore: null,
      technicalScoreAt: null,
      technicalScoreSource: null,
    },
  });

  const application = toRecord(row);

  await auditLog({
    actorId,
    action: 'hiring_application.submit',
    entityType: 'hiring_application',
    entityId: application.id,
    payload: {
      email: application.email,
      roleApplied: application.roleApplied,
      resumeStorageKey: application.resumeStorageKey,
      resumeSizeBytes: application.resumeSizeBytes,
    },
  });

  return { ok: true, application };
}
