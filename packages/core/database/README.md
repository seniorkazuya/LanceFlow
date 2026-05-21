# @lanceflow/database

Prisma schema and client for LanceFlow (CORE-001).

## Models

| Model | Purpose |
|-------|---------|
| `User` | Platform users — `email`, `role`, `status`, `displayName` |
| `AuditLog` | Immutable audit trail — `action`, `entityType`, `entityId`, `payload` |
| `Client` (`ops_clients`) | Name, contact, status, risk score (OPS-001) |

## Scripts

```bash
pnpm --filter @lanceflow/database db:generate
pnpm --filter @lanceflow/database db:migrate        # dev
pnpm db:migrate:deploy                              # CI / staging deploy
```

Requires `DATABASE_URL` (see root `.env.example` and `docker compose up -d`).

## Usage

```typescript
import { prisma } from '@lanceflow/database';

const user = await prisma.user.findUnique({ where: { email: 'ops@example.com' } });
```
