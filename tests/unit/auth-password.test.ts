import { describe, expect, it } from 'vitest';
import { hashPassword, validatePortalRegistrationInput, verifyPassword } from '@lanceflow/auth';

describe('password hashing', () => {
  it('verifies a password against its hash', () => {
    const hash = hashPassword('test-password-123');
    expect(verifyPassword('test-password-123', hash)).toBe(true);
    expect(verifyPassword('wrong', hash)).toBe(false);
  });
});

describe('validatePortalRegistrationInput', () => {
  it('normalizes email and enforces minimum password length', () => {
    const result = validatePortalRegistrationInput({
      email: ' Client@Example.COM ',
      password: 'longenough',
      displayName: ' Client User ',
    });
    expect(result.email).toBe('client@example.com');
    expect(result.displayName).toBe('Client User');
  });

  it('rejects short passwords', () => {
    expect(() =>
      validatePortalRegistrationInput({ email: 'a@b.co', password: 'short' })
    ).toThrow(/8 characters/);
  });
});
