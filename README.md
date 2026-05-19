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

Copy `.env.example` → `.env` before database migrations (story CORE-001).

## Documentation

| Audience | Document |
|----------|----------|
| **Current status** | [documents/docs/PROJECT_STATUS.md](documents/docs/PROJECT_STATUS.md) |
| **DevOps (GitHub, deploy)** | [documents/docs/DEVOPS_GUIDE.md](documents/docs/DEVOPS_GUIDE.md) |
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
