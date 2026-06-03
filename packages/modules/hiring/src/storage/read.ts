import { readResumeFromLocal } from './read-local';
import { readResumeFromS3 } from './read-s3';

/** Load resume bytes by storage key from local or S3. */
export async function readResume(storageKey: string): Promise<Buffer> {
  if (storageKey.startsWith('local/')) {
    return readResumeFromLocal(storageKey);
  }
  return readResumeFromS3(storageKey);
}
