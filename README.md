# LanceFlow

Structured performance ecosystem — *Where Strong Action Meets Seamless Flow.*

## Quick start

**Prerequisites:** Node.js 20+, pnpm 9 (`npm install -g pnpm` or `corepack enable`)

```bash
cd d:\Projects\LanceFlow
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) · Health API: [http://localhost:3000/api/health](http://localhost:3000/api/health)

```bash
pnpm build      # production build (all packages)
pnpm typecheck
pnpm lint
```

Copy `.env.example` → `.env` before database migrations.

### Local database (Docker)

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/)

```bash
docker compose up -d              # Postgres :5432, Redis :6379
docker compose --profile storage up -d   # + MinIO :9000 (API), :9001 (console)
docker compose down               # stop; add -v to remove volumes
```

Then run migrations:

```bash
pnpm db:migrate:deploy   # requires DATABASE_URL in .env (matches .env.example)
```

## Documentation

| Audience | Document |
|----------|----------|
| **Current status** | [documents/docs/PROJECT_STATUS.md](documents/docs/PROJECT_STATUS.md) |
| **DevOps (GitHub, deploy)** | [documents/docs/DEVOPS_GUIDE.md](documents/docs/DEVOPS_GUIDE.md) |
| **Observability** | [documents/docs/OBSERVABILITY.md](documents/docs/OBSERVABILITY.md) |
| **Active stories** | [documents/stories/](documents/stories/) |
| **Architecture** | [documents/docs/MODULAR_ARCHITECTURE.md](documents/docs/MODULAR_ARCHITECTURE.md) |

## Repo layout

```
apps/web              → Next.js app
packages/core/types   → shared types
packages/core/database → Prisma (PostgreSQL)
packages/modules/     → domain modules (added per story)
documents/            → planning & story prompts
```
