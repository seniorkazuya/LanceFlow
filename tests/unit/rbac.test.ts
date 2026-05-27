import { describe, expect, it } from 'vitest';
import {
  ForbiddenError,
  RolePolicy,
  UnauthorizedError,
  assertRole,
  authorizeRequest,
  hasRole,
  isAuthRouteFailure,
  withAuth,
} from '@lanceflow/auth';
import { UserRole } from '@lanceflow/types';

const opsUser = {
  id: '1',
  email: 'ops@test',
  displayName: 'Ops',
  role: UserRole.OPS_MANAGER,
};

const engineerUser = {
  id: '2',
  email: 'eng@test',
  displayName: 'Eng',
  role: UserRole.ENGINEER,
};

describe('hasRole', () => {
  it('allows listed roles', () => {
    expect(hasRole(UserRole.CEO, RolePolicy.controlCenter)).toBe(true);
    expect(hasRole(UserRole.ENGINEER, RolePolicy.controlCenter)).toBe(false);
  });

  it('restricts audit read to CEO', () => {
    expect(hasRole(UserRole.CEO, RolePolicy.auditRead)).toBe(true);
    expect(hasRole(UserRole.OPS_MANAGER, RolePolicy.auditRead)).toBe(false);
  });

  it('allows client read for ops and bidder', () => {
    expect(hasRole(UserRole.OPS_MANAGER, RolePolicy.clientsRead)).toBe(true);
    expect(hasRole(UserRole.BIDDER, RolePolicy.clientsRead)).toBe(true);
    expect(hasRole(UserRole.ENGINEER, RolePolicy.clientsRead)).toBe(false);
  });

  it('allows client write for ops only', () => {
    expect(hasRole(UserRole.OPS_MANAGER, RolePolicy.clientsWrite)).toBe(true);
    expect(hasRole(UserRole.BIDDER, RolePolicy.clientsWrite)).toBe(false);
  });

  it('allows client risk prescreen for bidder and ops', () => {
    expect(hasRole(UserRole.BIDDER, RolePolicy.clientRiskPrescreen)).toBe(true);
    expect(hasRole(UserRole.OPS_MANAGER, RolePolicy.clientRiskPrescreen)).toBe(true);
    expect(hasRole(UserRole.ENGINEER, RolePolicy.clientRiskPrescreen)).toBe(false);
  });

  it('allows workers read for ops and ceo only', () => {
    expect(hasRole(UserRole.OPS_MANAGER, RolePolicy.workersRead)).toBe(true);
    expect(hasRole(UserRole.CEO, RolePolicy.workersRead)).toBe(true);
    expect(hasRole(UserRole.ENGINEER, RolePolicy.workersRead)).toBe(false);
  });
  it('restricts daily report submit to engineers', () => {
    expect(hasRole(UserRole.ENGINEER, RolePolicy.dailyReportsSubmit)).toBe(true);
    expect(hasRole(UserRole.OPS_MANAGER, RolePolicy.dailyReportsSubmit)).toBe(false);
  });

  it('allows missing reports read for ops and ceo', () => {
    expect(hasRole(UserRole.OPS_MANAGER, RolePolicy.missingReportsRead)).toBe(true);
    expect(hasRole(UserRole.ENGINEER, RolePolicy.missingReportsRead)).toBe(false);
  });

  it('allows all operational roles to read SOPs', () => {
    expect(hasRole(UserRole.ENGINEER, RolePolicy.sopsRead)).toBe(true);
    expect(hasRole(UserRole.CALLER, RolePolicy.sopsRead)).toBe(true);
  });

  it('restricts ops console to CEO and ops manager', () => {
    expect(hasRole(UserRole.OPS_MANAGER, RolePolicy.opsConsoleRead)).toBe(true);
    expect(hasRole(UserRole.CEO, RolePolicy.opsConsoleRead)).toBe(true);
    expect(hasRole(UserRole.BIDDER, RolePolicy.opsConsoleRead)).toBe(false);
  });
});

describe('assertRole', () => {
  it('throws UnauthorizedError when role missing', () => {
    expect(() => assertRole('', RolePolicy.authenticated)).toThrow(UnauthorizedError);
  });

  it('throws ForbiddenError for disallowed role', () => {
    expect(() => assertRole(UserRole.ENGINEER, RolePolicy.controlCenter)).toThrow(
      ForbiddenError
    );
  });
});

describe('authorizeRequest', () => {
  it('returns 401 without user', () => {
    const result = authorizeRequest(null, RolePolicy.authenticated);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(401);
  });

  it('returns 403 for engineer on control center', () => {
    const result = authorizeRequest(engineerUser, RolePolicy.controlCenter);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(403);
  });

  it('allows ops on control center', () => {
    const result = authorizeRequest(opsUser, RolePolicy.controlCenter);
    expect(result.ok).toBe(true);
  });
});

describe('engineer cannot access hiring CEO queue', () => {
  it('denies engineer', () => {
    const result = authorizeRequest(engineerUser, RolePolicy.hiringCeoQueue);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(403);
  });

  it('denies caller', () => {
    const caller = { ...engineerUser, role: UserRole.CALLER };
    const result = authorizeRequest(caller, RolePolicy.hiringCeoQueue);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(403);
  });

  it('allows CEO', () => {
    const ceo = { ...engineerUser, role: UserRole.CEO };
    const result = authorizeRequest(ceo, RolePolicy.hiringCeoQueue);
    expect(result.ok).toBe(true);
  });
});

describe('withAuth', () => {
  it('returns forbidden outcome for wrong role', async () => {
    const handler = withAuth(RolePolicy.controlCenter, async () => new Response('ok'));
    const outcome = await handler(new Request('http://test'), engineerUser);
    expect(isAuthRouteFailure(outcome)).toBe(true);
    if (isAuthRouteFailure(outcome)) expect(outcome.status).toBe(403);
  });

  it('runs handler when authorized', async () => {
    const handler = withAuth(RolePolicy.controlCenter, async () => new Response('ok'));
    const outcome = await handler(new Request('http://test'), opsUser);
    expect(outcome).toBeInstanceOf(Response);
  });
});
