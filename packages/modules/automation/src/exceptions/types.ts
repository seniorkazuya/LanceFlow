/** Red / yellow / green alignment (AUTO-008). */
export const EXCEPTION_SEVERITIES = ['danger', 'warning', 'success'] as const;
export type ExceptionSeverity = (typeof EXCEPTION_SEVERITIES)[number];

export const EXCEPTION_STATUSES = ['open', 'acknowledged', 'resolved'] as const;
export type ExceptionStatus = (typeof EXCEPTION_STATUSES)[number];

export type LeadershipExceptionRecord = {
  id: string;
  sourceKey: string;
  severity: ExceptionSeverity;
  category: string;
  title: string;
  summary: string;
  entityType: string;
  entityId: string;
  status: ExceptionStatus;
  acknowledgedAt: Date | null;
  acknowledgedBy: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ExceptionInboxSummary = {
  open: number;
  danger: number;
  warning: number;
  success: number;
};

export type UpsertExceptionInput = {
  sourceKey: string;
  severity: ExceptionSeverity;
  category: string;
  title: string;
  summary: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
};
