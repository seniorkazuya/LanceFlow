export type NotificationRecord = {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  readAt: Date | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
};

export type NotifyUserInput = {
  userId: string;
  type: string;
  title: string;
  body: string;
  metadata?: Record<string, unknown>;
  /** When true and user has email, sends via configured email adapter. */
  sendEmail?: boolean;
};

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export type EmailSendResult =
  | { ok: true; provider: string }
  | { ok: false; provider: string; error: string };

export interface EmailAdapter {
  readonly provider: string;
  send(message: EmailMessage): Promise<EmailSendResult>;
}
