import { GetObjectCommand } from '@aws-sdk/client-s3';

import { createS3Client, isS3StorageConfigured } from './s3';

export async function readResumeFromS3(storageKey: string): Promise<Buffer> {
  if (!isS3StorageConfigured()) {
    throw new Error('S3 storage is not configured');
  }
  const bucket = process.env.S3_BUCKET!.trim();
  const client = createS3Client();
  const out = await client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: storageKey,
    })
  );
  const bytes = await out.Body?.transformToByteArray();
  if (!bytes) {
    throw new Error('Empty resume object');
  }
  return Buffer.from(bytes);
}
