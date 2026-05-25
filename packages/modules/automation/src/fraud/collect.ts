import { prisma } from '@lanceflow/database';
import { listMissingDailyReports } from '@lanceflow/operations';

import type { UpsertExceptionInput } from '../exceptions/types';
import {
  addUtcDays,
  isExcessiveDailyHours,
  isProgressSpike,
  startOfUtcDay,
} from './evaluate';
import { FRAUD_FORMULA_VERSION, FRAUD_THRESHOLDS } from './types';

const LOOKBACK_DAYS = 14;

function fraudException(
  sourceKey: string,
  severity: 'danger' | 'warning',
  title: string,
  summary: string,
  entityType: string,
  entityId: string,
  metadata: Record<string, unknown>
): UpsertExceptionInput {
  return {
    sourceKey,
    severity,
    category: 'fraud',
    title,
    summary,
    entityType,
    entityId,
    metadata: { ...metadata, formulaVersion: FRAUD_FORMULA_VERSION },
  };
}

/** PAY-004 — rule-based fraud signals as leadership exceptions. */
export async function collectFraudExceptionCandidates(
  asOf: Date = new Date()
): Promise<UpsertExceptionInput[]> {
  const items: UpsertExceptionInput[] = [];
  const asOfDay = startOfUtcDay(asOf);
  const lookbackStart = addUtcDays(asOfDay, -LOOKBACK_DAYS);

  const recentReports = await prisma.dailyReport.findMany({
    where: { reportDate: { gte: lookbackStart, lte: asOfDay } },
    include: {
      user: { select: { displayName: true } },
      project: { select: { title: true } },
    },
    orderBy: [{ userId: 'asc' }, { projectId: 'asc' }, { reportDate: 'asc' }],
  });

  for (const report of recentReports) {
    if (isExcessiveDailyHours(report.hours)) {
      items.push(
        fraudException(
          `fraud:excessive_hours:${report.id}`,
          'danger',
          `Excessive hours: ${report.user.displayName}`,
          `${report.hours}h on ${report.reportDate.toISOString().slice(0, 10)} · ${report.project.title} (max ${FRAUD_THRESHOLDS.maxDailyHours}h)`,
          'daily_report',
          report.id,
          {
            ruleKey: 'excessive_daily_hours',
            userId: report.userId,
            projectId: report.projectId,
            hours: report.hours,
          }
        )
      );
    }
  }

  const priorMax = new Map<string, number>();
  for (const report of recentReports) {
    const key = `${report.userId}:${report.projectId}`;
    const prev = priorMax.get(key) ?? 0;
    if (isProgressSpike(report.progressPct, prev)) {
      items.push(
        fraudException(
          `fraud:progress_spike:${report.id}`,
          'danger',
          `Progress spike: ${report.user.displayName}`,
          `Reported ${report.progressPct}% vs prior max ${prev}% on ${report.project.title}`,
          'daily_report',
          report.id,
          {
            ruleKey: 'progress_spike',
            userId: report.userId,
            projectId: report.projectId,
            progressPct: report.progressPct,
            priorMaxPct: prev,
          }
        )
      );
    }
    priorMax.set(key, Math.max(prev, report.progressPct));
  }

  type MissingRow = Awaited<ReturnType<typeof listMissingDailyReports>>[number];
  let streakKeys: Set<string> | null = null;
  const missingByKey = new Map<string, MissingRow>();

  for (let day = 1; day <= FRAUD_THRESHOLDS.missingReportDays; day += 1) {
    const date = addUtcDays(asOfDay, -day);
    const missingRows = await listMissingDailyReports(date);
    const dayKeys = new Set(missingRows.map((row) => `${row.userId}:${row.projectId}`));
    for (const row of missingRows) {
      missingByKey.set(`${row.userId}:${row.projectId}`, row);
    }
    if (streakKeys === null) {
      streakKeys = dayKeys;
    } else {
      const next = new Set<string>();
      for (const k of streakKeys) {
        if (dayKeys.has(k)) next.add(k);
      }
      streakKeys = next;
    }
  }

  for (const key of streakKeys ?? []) {
    const row = missingByKey.get(key);
    if (!row) continue;
    items.push(
      fraudException(
        `fraud:missing_reports:${row.userId}:${row.projectId}`,
        'danger',
        `Repeated missing reports: ${row.engineerName}`,
        `No report for ${FRAUD_THRESHOLDS.missingReportDays} consecutive days · ${row.projectTitle} (${row.clientName})`,
        'assignment',
        row.projectId,
        {
          ruleKey: 'missing_report_streak',
          userId: row.userId,
          projectId: row.projectId,
          days: FRAUD_THRESHOLDS.missingReportDays,
        }
      )
    );
  }

  const escalated = await prisma.paymentSchedule.findMany({
    where: { status: 'scheduled', escalationLevel: { gte: 3 } },
    include: { project: { select: { title: true, id: true } } },
    take: 30,
  });

  for (const payment of escalated) {
    const missingToday = await listMissingDailyReports(asOfDay);
    const hasMissingOnProject = missingToday.some((m) => m.projectId === payment.projectId);
    if (!hasMissingOnProject) continue;

    items.push(
      fraudException(
        `fraud:payment_delay_reports:${payment.projectId}`,
        'danger',
        `Payment risk + missing reports: ${payment.project.title}`,
        `Escalation L${payment.escalationLevel} and engineers missing daily reports on active project`,
        'project',
        payment.projectId,
        {
          ruleKey: 'payment_delay_missing_reports',
          paymentScheduleId: payment.id,
          escalationLevel: payment.escalationLevel,
        }
      )
    );
  }

  return items;
}
