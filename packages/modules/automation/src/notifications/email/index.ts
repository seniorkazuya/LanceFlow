import type { EmailAdapter } from '../types';
import { createResendEmailAdapter } from './resend-adapter';
import { noopEmailAdapter } from './noop-adapter';

export function getEmailAdapter(): EmailAdapter {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.NOTIFICATION_FROM_EMAIL?.trim() ?? 'LanceFlow <notifications@lanceflow.app>';

  if (apiKey) {
    return createResendEmailAdapter(apiKey, from);
  }

  return noopEmailAdapter;
}

export { noopEmailAdapter, createResendEmailAdapter };
