import type { DailyReportRecord, MissingDailyReport } from '@lanceflow/operations';

export function serializeDailyReport(report: DailyReportRecord) {
  return {
    ...report,
    reportDate: report.reportDate.toISOString().slice(0, 10),
    createdAt: report.createdAt.toISOString(),
    updatedAt: report.updatedAt.toISOString(),
  };
}

export function serializeMissingReport(row: MissingDailyReport) {
  return {
    ...row,
    reportDate: row.reportDate.toISOString().slice(0, 10),
  };
}
