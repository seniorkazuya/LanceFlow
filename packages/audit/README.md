# @lanceflow/audit

Immutable audit trail (CORE-006). Insert-only via `auditLog`; paginated reads via `queryAuditLogs`.

## Usage

```ts
import { auditLog, queryAuditLogs } from '@lanceflow/audit';

await auditLog({
  actorId: user.id,
  action: 'auth.sign_in',
  entityType: 'user',
  entityId: user.id,
  payload: { email: user.email },
});

const page = await queryAuditLogs({ page: 1, pageSize: 20 });
```

CEO-only HTTP access: `GET /api/audit/logs` on the web app.
