import type { ApiHealth } from '@lanceflow/types';
import { NextResponse } from 'next/server';

const APP_VERSION = '0.0.1-dev';

export async function GET() {
  const body: ApiHealth = {
    status: 'ok',
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(body);
}
