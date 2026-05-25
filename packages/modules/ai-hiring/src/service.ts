import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';
import { getHiringApplicationById, readResume } from '@lanceflow/hiring';

import { extractResumeText } from './extract-text';
import { parseResumeText } from './parser';
import { ParsedResumeSchema, type ParsedResume } from './schema';

export type ParseHiringResumeResult =
  | { ok: true; applicationId: string; parsed: ParsedResume }
  | { ok: false; errors: { field: string; message: string }[] };

/** HIRE-002 — extract structured resume fields and persist on application. */
export async function parseHiringApplicationResume(
  applicationId: string,
  actorId: string
): Promise<ParseHiringResumeResult> {
  const application = await getHiringApplicationById(applicationId);
  if (!application) {
    return { ok: false, errors: [{ field: 'applicationId', message: 'Application not found' }] };
  }

  let bytes: Buffer;
  try {
    bytes = await readResume(application.resumeStorageKey);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to read resume';
    return { ok: false, errors: [{ field: 'resume', message }] };
  }

  const text = extractResumeText(bytes, application.resumeMimeType);
  if (text.length < 20) {
    return {
      ok: false,
      errors: [{ field: 'resume', message: 'Resume has insufficient extractable text' }],
    };
  }

  const parsed = ParsedResumeSchema.parse(await parseResumeText(text));
  const now = new Date();

  await prisma.hiringApplication.update({
    where: { id: applicationId },
    data: {
      resumeParsed: parsed,
      resumeParsedAt: now,
      resumeParseVersion: parsed.formulaVersion,
      status: 'parsed',
    },
  });

  await auditLog({
    actorId,
    action: 'hiring_application.parse_resume',
    entityType: 'hiring_application',
    entityId: applicationId,
    payload: {
      formulaVersion: parsed.formulaVersion,
      yearsExperience: parsed.yearsExperience,
      seniority: parsed.seniority,
      jobHopIndex: parsed.jobHopIndex,
      stackCount: parsed.stack.length,
    },
  });

  return { ok: true, applicationId, parsed };
}
