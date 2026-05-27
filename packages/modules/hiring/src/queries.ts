import { prisma } from '@lanceflow/database';

import { mapHiringApplicationRow } from './record-mapper';
import type { HiringApplicationRecord } from './types';

export async function getHiringApplicationById(
  id: string
): Promise<HiringApplicationRecord | null> {
  const row = await prisma.hiringApplication.findUnique({ where: { id } });
  return row ? mapHiringApplicationRow(row) : null;
}
