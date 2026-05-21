# @lanceflow/operations

Operations domain module (OPS-* stories). Owns clients, projects, assignments, and daily reports.

## OPS-001 — Clients

```ts
import { createClient, listClients } from '@lanceflow/operations';
```

HTTP surface lives in `apps/web` under `/api/clients` (thin BFF).
