import { readFile } from 'node:fs/promises';
import path from 'node:path';

const LOCAL_ROOT = process.env.HIRING_RESUME_LOCAL_DIR?.trim() || '.data/hiring-resumes';

export async function readResumeFromLocal(storageKey: string): Promise<Buffer> {
  if (!storageKey.startsWith('local/')) {
    throw new Error('Invalid local resume storage key');
  }
  const parts = storageKey.split('/');
  const applicationId = parts[1];
  const fileName = parts.slice(2).join('/');
  if (!applicationId || !fileName) {
    throw new Error('Invalid local resume storage key');
  }
  const fullPath = path.join(LOCAL_ROOT, applicationId, fileName);
  return readFile(fullPath);
}
