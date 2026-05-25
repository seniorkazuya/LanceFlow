import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const LOCAL_ROOT = process.env.HIRING_RESUME_LOCAL_DIR?.trim() || '.data/hiring-resumes';

/** Dev/test fallback when S3 is not configured. */
export async function uploadResumeToLocal(params: {
  applicationId: string;
  fileName: string;
  body: Buffer;
}): Promise<string> {
  const safeName = params.fileName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
  const key = `local/${params.applicationId}/${safeName}`;
  const fullPath = path.join(LOCAL_ROOT, params.applicationId, safeName);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, params.body);
  return key;
}
