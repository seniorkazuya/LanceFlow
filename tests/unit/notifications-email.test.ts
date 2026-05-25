import { afterEach, describe, expect, it } from 'vitest';

import { getEmailAdapter, noopEmailAdapter } from '@lanceflow/automation';

describe('email adapter (AUTO-007)', () => {
  const previous = process.env.RESEND_API_KEY;

  afterEach(() => {
    if (previous === undefined) {
      delete process.env.RESEND_API_KEY;
    } else {
      process.env.RESEND_API_KEY = previous;
    }
  });

  it('uses noop when RESEND_API_KEY is unset', () => {
    delete process.env.RESEND_API_KEY;
    expect(getEmailAdapter().provider).toBe('noop');
  });

  it('noop adapter succeeds without network', async () => {
    const result = await noopEmailAdapter.send({
      to: 'ops@lanceflow.test',
      subject: 'Test',
      text: 'Hello',
    });
    expect(result.ok).toBe(true);
  });
});
