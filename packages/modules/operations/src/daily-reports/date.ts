/** UTC calendar date for daily report uniqueness (OPS-006). */
export function utcReportDate(from = new Date()): Date {
  return new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
}
