import type { WorkerRecord } from '@lanceflow/operations';

export function serializeWorker(worker: WorkerRecord) {
  return worker;
}

export { parseJsonBody } from './clients-api';
