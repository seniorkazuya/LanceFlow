import type { HealthCheckStatus } from '@lanceflow/types';
import Redis from 'ioredis';
import pg from 'pg';

const CHECK_TIMEOUT_MS = 3_000;

export async function checkDatabase(
  databaseUrl: string | undefined,
): Promise<HealthCheckStatus> {
  if (!databaseUrl) return 'skipped';

  const client = new pg.Client({
    connectionString: databaseUrl,
    connectionTimeoutMillis: CHECK_TIMEOUT_MS,
  });

  try {
    await client.connect();
    await client.query('SELECT 1');
    return 'ok';
  } catch {
    return 'error';
  } finally {
    await client.end().catch(() => undefined);
  }
}

export async function checkRedis(redisUrl: string | undefined): Promise<HealthCheckStatus> {
  if (!redisUrl) return 'skipped';
  if (/localhost|127\.0\.0\.1/i.test(redisUrl)) return 'skipped';

  const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    connectTimeout: CHECK_TIMEOUT_MS,
    lazyConnect: true,
  });

  try {
    await redis.connect();
    const pong = await redis.ping();
    return pong === 'PONG' ? 'ok' : 'error';
  } catch {
    return 'error';
  } finally {
    redis.disconnect();
  }
}

export function resolveHealthStatus(
  database: HealthCheckStatus,
  redis: HealthCheckStatus,
): 'ok' | 'degraded' {
  if (database === 'error') return 'degraded';
  // Redis is optional for the web app; report check status but do not fail deploy health.
  void redis;
  return 'ok';
}
