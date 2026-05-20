import type { ApiHealth } from '@lanceflow/types';
import { NextResponse } from 'next/server';

const APP_VERSION = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? '0.0.1-dev';

export async function GET() {
  const body: ApiHealth = {
    status: 'ok',
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(body);
}
