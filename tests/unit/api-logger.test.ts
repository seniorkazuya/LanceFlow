import { afterEach, describe, expect, it, vi } from 'vitest';
import { logApiEvent, redactHeaderName } from '@lanceflow/config';

describe('logApiEvent', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('writes structured JSON to stdout', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    logApiEvent({
      level: 'info',
      route: '/api/health',
      method: 'GET',
      durationMs: 12,
      status: 200,
    });

    expect(spy).toHaveBeenCalledOnce();
    const line = JSON.parse(String(spy.mock.calls[0]?.[0])) as Record<string, unknown>;
    expect(line).toMatchObject({
      type: 'api',
      level: 'info',
      route: '/api/health',
      method: 'GET',
      durationMs: 12,
      status: 200,
    });
    expect(line.timestamp).toBeTypeOf('string');
  });

  it('redacts bearer tokens in messages', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    logApiEvent({
      level: 'error',
      route: '/api/test',
      method: 'POST',
      message: 'failed Bearer secret-token-value',
    });

    const line = JSON.parse(String(spy.mock.calls[0]?.[0])) as { message: string };
    expect(line.message).toContain('[REDACTED]');
    expect(line.message).not.toContain('secret-token');
  });
});

describe('redactHeaderName', () => {
  it('flags sensitive headers', () => {
    expect(redactHeaderName('Authorization')).toBe(true);
    expect(redactHeaderName('cookie')).toBe(true);
    expect(redactHeaderName('Content-Type')).toBe(false);
  });
});
