import { auditLog } from '@lanceflow/audit';
import { prisma } from '@lanceflow/database';
import { getHiringApplicationById, readResume } from '@lanceflow/hiring';

import {
  CommunicationScoresSchema,
  scoreCommunicationText,
  type CommunicationScores,
} from './communication';
import { extractResumeText } from './extract-text';

export type AnalyzeHiringCommunicationResult =
  | {
      ok: true;
      applicationId: string;
      scores: CommunicationScores;
      llmInvoked: boolean;
      costCapReached: boolean;
    }
  | { ok: false; errors: { field: string; message: string }[] };

/** AI-001 — score grammar, clarity, persuasion on resume written sample. */
export async function analyzeHiringApplicationCommunication(
  applicationId: string,
  actorId: string
): Promise<AnalyzeHiringCommunicationResult> {
  const application = await getHiringApplicationById(applicationId);
  if (!application) {
    return { ok: false, errors: [{ field: 'applicationId', message: 'Application not found' }] };
  }

  const row = await prisma.hiringApplication.findUnique({
    where: { id: applicationId },
    select: {
      resumeParsedAt: true,
      communicationLlmCalls: true,
    },
  });
  if (!row?.resumeParsedAt) {
    return {
      ok: false,
      errors: [
        {
          field: 'applicationId',
          message: 'Resume must be parsed before communication analysis (run parse first)',
        },
      ],
    };
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

  const scored = await scoreCommunicationText(text, {
    currentLlmCalls: row.communicationLlmCalls,
  });
  const scores = CommunicationScoresSchema.parse({
    grammar: scored.grammar,
    clarity: scored.clarity,
    persuasion: scored.persuasion,
    formulaVersion: scored.formulaVersion,
    source: scored.source,
    notes: scored.notes,
  });

  const now = new Date();
  const nextLlmCalls = row.communicationLlmCalls + (scored.llmInvoked ? 1 : 0);

  await prisma.hiringApplication.update({
    where: { id: applicationId },
    data: {
      communicationScores: scores,
      communicationScoredAt: now,
      communicationLlmCalls: nextLlmCalls,
    },
  });

  await auditLog({
    actorId,
    action: 'hiring_application.analyze_communication',
    entityType: 'hiring_application',
    entityId: applicationId,
    payload: {
      formulaVersion: scores.formulaVersion,
      source: scores.source,
      grammar: scores.grammar,
      clarity: scores.clarity,
      persuasion: scores.persuasion,
      llmInvoked: scored.llmInvoked,
      costCapReached: scored.costCapReached,
      communicationLlmCalls: nextLlmCalls,
    },
  });

  return {
    ok: true,
    applicationId,
    scores,
    llmInvoked: scored.llmInvoked,
    costCapReached: scored.costCapReached,
  };
}
