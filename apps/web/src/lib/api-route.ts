import { logApiEvent, type ApiLogLevel } from '@lanceflow/config';
import { NextResponse } from 'next/server';

type RouteHandler = (request: Request) => Promise<Response> | Response;

/** Wrap API route handlers with structured JSON request logging. */
export function withApiLogging(route: string, handler: RouteHandler): RouteHandler {
  return async (request: Request) => {
    const started = Date.now();
    const method = request.method;

    try {
      const response = await handler(request);
      const level: ApiLogLevel = response.status >= 500 ? 'error' : response.status >= 400 ? 'warn' : 'info';

      logApiEvent({
        level,
        route,
        method,
        durationMs: Date.now() - started,
        status: response.status,
      });

      return response;
    } catch (error) {
      logApiEvent({
        level: 'error',
        route,
        method,
        durationMs: Date.now() - started,
        status: 500,
        message: error instanceof Error ? error.message : 'unknown error',
      });
      throw error;
    }
  };
}

export function jsonError(route: string, message: string, status = 500): Response {
  logApiEvent({ level: 'error', route, method: 'GET', status, message });
  return NextResponse.json({ error: message }, { status });
}
