import { isS3StorageConfigured, uploadResumeToStorage } from './s3';
import { uploadResumeToLocal } from './local';

export { isS3StorageConfigured };
export { readResume } from './read';

export async function storeResume(params: {
  applicationId: string;
  fileName: string;
  mimeType: string;
  body: Buffer;
}): Promise<string> {
  if (isS3StorageConfigured()) {
    return uploadResumeToStorage(params);
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('S3 storage is required in production (set S3_BUCKET and credentials)');
  }
  return uploadResumeToLocal(params);
}
