import { prisma } from '@lanceflow/database';
import {
  AccountType,
  UserRole,
  type AccountType as AccountTypeValue,
  type PortalAccountType,
} from '@lanceflow/types';

import { hashPassword, verifyPassword } from './password';
import type { SessionUser } from './types';

const PORTAL_ROLE: Record<PortalAccountType, (typeof UserRole)[keyof typeof UserRole]> = {
  [AccountType.CLIENT]: UserRole.CLIENT,
  [AccountType.DEVELOPER]: UserRole.DEVELOPER,
};

export class AuthRegistrationError extends Error {
  constructor(
    message: string,
    readonly code: 'EMAIL_TAKEN' | 'INVALID_INPUT'
  ) {
    super(message);
    this.name = 'AuthRegistrationError';
  }
}

export function normalizeAuthEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validatePortalRegistrationInput(input: {
  email: string;
  password: string;
  displayName?: string;
}): { email: string; password: string; displayName: string } {
  const email = normalizeAuthEmail(input.email);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AuthRegistrationError('Enter a valid email address.', 'INVALID_INPUT');
  }
  const password = input.password?.trim() ?? '';
  if (password.length < 8) {
    throw new AuthRegistrationError('Password must be at least 8 characters.', 'INVALID_INPUT');
  }
  const displayName = (input.displayName?.trim() || email.split('@')[0] || 'User').slice(0, 120);
  return { email, password, displayName };
}

export async function registerPortalUser(params: {
  email: string;
  password: string;
  displayName?: string;
  accountType: PortalAccountType;
}): Promise<SessionUser> {
  const { email, password, displayName } = validatePortalRegistrationInput(params);
  const role = PORTAL_ROLE[params.accountType];

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AuthRegistrationError('An account with this email already exists.', 'EMAIL_TAKEN');
  }

  const user = await prisma.user.create({
    data: {
      email,
      displayName,
      role,
      accountType: params.accountType,
      passwordHash: hashPassword(password),
    },
  });

  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role as SessionUser['role'],
    accountType: user.accountType as AccountTypeValue,
  };
}

export async function authenticatePortalUser(
  email: string,
  password: string
): Promise<SessionUser | null> {
  const normalized = normalizeAuthEmail(email);
  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user?.passwordHash) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;
  if (user.status !== 'active') return null;

  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role as SessionUser['role'],
    accountType: user.accountType as AccountTypeValue,
  };
}

export function postLoginPathForRole(role: string): string {
  if (role === UserRole.CLIENT) return '/dashboard';
  if (role === UserRole.DEVELOPER) return '/apply';
  return '/dashboard';
}
