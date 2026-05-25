import type { EmailAdapter, EmailMessage, EmailSendResult } from '../types';

/** Logs only — used when no email provider is configured. */
export const noopEmailAdapter: EmailAdapter = {
  provider: 'noop',
  async send(message: EmailMessage): Promise<EmailSendResult> {
    if (process.env.NODE_ENV !== 'test') {
      console.info('[email:noop]', message.to, message.subject);
    }
    return { ok: true, provider: 'noop' };
  },
};
