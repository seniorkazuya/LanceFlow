import { describe, expect, it } from 'vitest';
import { normalizeAuditPagination } from '@lanceflow/audit';

describe('normalizeAuditPagination', () => {
  it('defaults to page 1 and size 20', () => {
    expect(normalizeAuditPagination({})).toEqual({ page: 1, pageSize: 20, skip: 0 });
  });

  it('clamps invalid page to 1', () => {
    expect(normalizeAuditPagination({ page: 0, pageSize: 10 })).toEqual({
      page: 1,
      pageSize: 10,
      skip: 0,
    });
  });

  it('caps page size at 100', () => {
    expect(normalizeAuditPagination({ page: 2, pageSize: 500 })).toEqual({
      page: 2,
      pageSize: 100,
      skip: 100,
    });
  });
});
