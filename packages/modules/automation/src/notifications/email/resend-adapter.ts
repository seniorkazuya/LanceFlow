import type { EmailAdapter, EmailMessage, EmailSendResult } from '../types';

const RESEND_API = 'https://api.resend.com/emails';

export function createResendEmailAdapter(apiKey: string, from: string): EmailAdapter {
  return {
    provider: 'resend',
    async send(message: EmailMessage): Promise<EmailSendResult> {
      const res = await fetch(RESEND_API, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [message.to],
          subject: message.subject,
          text: message.text,
          html: message.html ?? `<p>${escapeHtml(message.text)}</p>`,
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => res.statusText);
        return { ok: false, provider: 'resend', error: errText.slice(0, 500) };
      }

      return { ok: true, provider: 'resend' };
    },
  };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
