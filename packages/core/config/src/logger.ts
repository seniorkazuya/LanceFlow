export type ApiLogLevel = 'info' | 'warn' | 'error';

export type ApiLogEvent = {
  level: ApiLogLevel;
  route: string;
  method: string;
  durationMs?: number;
  status?: number;
  message?: string;
  requestId?: string;
};

const REDACT_KEYS = new Set(['authorization', 'cookie', 'set-cookie']);

/** Structured JSON log for API routes — no PII or secrets in fields. */
export function logApiEvent(event: ApiLogEvent): void {
  const payload = {
    type: 'api',
    timestamp: new Date().toISOString(),
    level: event.level,
    route: event.route,
    method: event.method,
    ...(event.durationMs !== undefined && { durationMs: event.durationMs }),
    ...(event.status !== undefined && { status: event.status }),
    ...(event.message !== undefined && { message: sanitizeMessage(event.message) }),
    ...(event.requestId !== undefined && { requestId: event.requestId }),
  };

  const line = JSON.stringify(payload);

  if (event.level === 'error') {
    console.error(line);
  } else if (event.level === 'warn') {
    console.warn(line);
  } else {
    console.log(line);
  }
}

function sanitizeMessage(message: string): string {
  return message.replace(/Bearer\s+\S+/gi, 'Bearer [REDACTED]');
}

export function redactHeaderName(name: string): boolean {
  return REDACT_KEYS.has(name.toLowerCase());
}
