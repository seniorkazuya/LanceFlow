import type { CompensationSuggestionRecord } from '@lanceflow/analytics';

export function serializeCompensationSuggestion(item: CompensationSuggestionRecord) {
  return item;
}

export function formatPercentBps(bps: number): string {
  return `${(bps / 100).toFixed(1)}%`;
}
