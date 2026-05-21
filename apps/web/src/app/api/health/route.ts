import {
  checkDatabase,
  checkRedis,
  logApiEvent,
  resolveHealthStatus,
} from '@lanceflow/config';
import type { ApiHealth } from '@lanceflow/types';
import { NextResponse } from 'next/server';

const APP_VERSION = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? '0.0.1-dev';

export async function GET() {
  const started = Date.now();

  const [database, redis] = await Promise.all([
    checkDatabase(process.env.DATABASE_URL),
    checkRedis(process.env.REDIS_URL),
  ]);

  const status = resolveHealthStatus(database, redis);
  const httpStatus = status === 'ok' ? 200 : 503;

  const body: ApiHealth = {
    status,
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
    checks: { database, redis },
  };

  logApiEvent({
    level: status === 'ok' ? 'info' : 'warn',
    route: '/api/health',
    method: 'GET',
    durationMs: Date.now() - started,
    status: httpStatus,
    message: status === 'ok' ? 'health ok' : 'health degraded',
  });

  return NextResponse.json(body, { status: httpStatus });
}
