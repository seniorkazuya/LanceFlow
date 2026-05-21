import { prisma } from '@lanceflow/database';
import type { Prisma } from '@prisma/client';

import type { AuditLogInput, AuditLogRecord } from './types';

/** Immutable insert-only audit entry (CORE-006). */
export async function auditLog(input: AuditLogInput): Promise<AuditLogRecord> {
  const payload: Prisma.InputJsonValue | undefined =
    input.payload === null || input.payload === undefined
      ? undefined
      : (input.payload as Prisma.InputJsonValue);

  const row = await prisma.auditLog.create({
    data: {
      actorId: input.actorId ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      payload,
    },
  });

  return {
    id: row.id,
    actorId: row.actorId,
    action: row.action,
    entityType: row.entityType,
    entityId: row.entityId,
    payload: row.payload,
    createdAt: row.createdAt,
  };
}
