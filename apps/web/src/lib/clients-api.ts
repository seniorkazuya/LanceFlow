import type { ClientRecord } from '@lanceflow/operations';

export function serializeClient(client: ClientRecord) {
  return {
    ...client,
    createdAt: client.createdAt.toISOString(),
    updatedAt: client.updatedAt.toISOString(),
  };
}

export async function parseJsonBody<T extends Record<string, unknown>>(
  request: Request
): Promise<T | null> {
  try {
    const body = (await request.json()) as T;
    return body && typeof body === 'object' ? body : null;
  } catch {
    return null;
  }
}
