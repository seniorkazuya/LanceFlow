import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';

export function isS3StorageConfigured(): boolean {
  return Boolean(
    process.env.S3_BUCKET?.trim() &&
      process.env.S3_ACCESS_KEY?.trim() &&
      process.env.S3_SECRET_KEY?.trim()
  );
}

export function createS3Client(): S3Client {
  const endpoint = process.env.S3_ENDPOINT?.trim();
  return new S3Client({
    region: process.env.S3_REGION?.trim() || 'us-east-1',
    endpoint: endpoint || undefined,
    forcePathStyle: Boolean(endpoint),
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!.trim(),
      secretAccessKey: process.env.S3_SECRET_KEY!.trim(),
    },
  });
}

/** Upload resume bytes to S3-compatible storage; returns object key. */
export async function uploadResumeToStorage(params: {
  applicationId: string;
  fileName: string;
  mimeType: string;
  body: Buffer;
}): Promise<string> {
  const bucket = process.env.S3_BUCKET!.trim();
  const safeName = params.fileName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
  const key = `hiring/applications/${params.applicationId}/${randomUUID()}-${safeName}`;

  const client = createS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: params.body,
      ContentType: params.mimeType,
    })
  );

  return key;
}
