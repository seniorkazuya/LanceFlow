import { describe, expect, it } from 'vitest';
import Redis from 'ioredis';
import pg from 'pg';

const databaseUrl = process.env.DATABASE_URL;
const redisUrl = process.env.REDIS_URL;
const runIntegration = Boolean(databaseUrl && redisUrl);

describe.runIf(runIntegration)('integration: infrastructure', () => {
  it('postgres accepts connections', async () => {
    const client = new pg.Client({ connectionString: databaseUrl! });
    await client.connect();
    const result = await client.query<{ n: number }>('SELECT 1 AS n');
    expect(result.rows[0]?.n).toBe(1);
    await client.end();
  });

  it('redis responds to PING', async () => {
    const redis = new Redis(redisUrl!, { maxRetriesPerRequest: 1 });
    expect(await redis.ping()).toBe('PONG');
    await redis.quit();
  });
});
