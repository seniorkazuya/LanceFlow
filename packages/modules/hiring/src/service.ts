import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';

import { mapHiringApplicationRow } from './record-mapper';
import { storeResume } from './storage';
import type { HiringApplicationRecord, SubmitApplicationInput } from './types';
import { validateSubmitApplicationInput } from './validate';

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

  const application = mapHiringApplicationRow(row);

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
