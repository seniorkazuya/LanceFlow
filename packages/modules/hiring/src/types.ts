import { UserRole } from '@lanceflow/types';

/** Roles candidates may apply for (HIRE-001). */
export const HIRING_APPLY_ROLES = [
  UserRole.ENGINEER,
  UserRole.BIDDER,
  UserRole.CALLER,
] as const;

export type HiringApplyRole = (typeof HIRING_APPLY_ROLES)[number];

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export const ALLOWED_RESUME_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

export type SubmitApplicationInput = {
  fullName: string;
  email: string;
  roleApplied: HiringApplyRole;
  consentGiven: boolean;
  resumeFileName: string;
  resumeMimeType: string;
  resumeBytes: Buffer;
};

export type HiringApplicationRecord = {
  id: string;
  fullName: string;
  email: string;
  roleApplied: string;
  resumeStorageKey: string;
  resumeFileName: string;
  resumeMimeType: string | null;
  resumeSizeBytes: number;
  consentGiven: boolean;
  consentAt: Date;
  status: string;
  createdAt: Date;
};
