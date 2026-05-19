# LanceFlow — DevOps Guide (GitHub, CI/CD, Deploy)

Practical handbook for day-to-day work. Detailed rules also live in [DEVOPS_AND_GITHUB_WORKFLOW.md](./DEVOPS_AND_GITHUB_WORKFLOW.md).

**Status tracking:** [PROJECT_STATUS.md](./PROJECT_STATUS.md) · Active story: see **Current work** section there.

---

## 1. Daily workflow (one story at a time)

```
1. Open documents/stories/<STORY-ID>.md
2. Copy "Development prompt" into Cursor (or ask agent to implement that story)
3. git checkout staging && git pull
4. git checkout -b feature/<STORY-ID>-<slug>
5. Implement → test locally → commit
6. git push -u origin feature/<STORY-ID>-<slug>
7. Open PR → staging (not main)
8. After review + green CI → merge
9. Verify staging deploy + update PROJECT_STATUS.md
10. Mark story Status = Done in story file
```

---

## 2. GitHub repository setup (Story DEV-002)

### 2.1 Create repo

1. GitHub → **New repository** → name `lanceflow` (or org prefix).
2. **Do not** add README/license if you already have local code (avoid merge conflicts).
3. Local first push:

```bash
cd d:\Projects\LanceFlow
git init
git add .
git commit -m "chore: initial monorepo scaffold (DEV-001)"
git branch -M main
git remote add origin https://github.com/<ORG>/lanceflow.git
git push -u origin main
git checkout -b staging
git push -u origin staging
```

### 2.2 Branches

| Branch | Use |
|--------|-----|
| `main` | Production releases only |
| `staging` | Integration + client demos |
| `feature/DEV-001-monorepo` | One story per branch |

### 2.3 Branch protection

**Settings → Branches → Add rule**

**`main`:**

- Require pull request before merging  
- Require approvals: **1** (2 for auth/rules-engine changes)  
- Require status checks: `CI` (after DEV-003)  
- Do not allow bypassing  

**`staging`:**

- Require pull request  
- Require status checks: `CI`  
- Allow squash merge  

### 2.4 GitHub Project (client visibility)

1. **Projects** → New project → Board  
2. Columns: Backlog | Ready | In Progress | In Review | QA / Staging | Done  
3. Link issues/cards to story IDs (`DEV-001`, etc.)  
4. Add client as **Read** on repo (optional) or share `PROJECT_STATUS.md` only  

### 2.5 Repo About section

- Website: staging URL (after DEV-004)  
- Description: link to `documents/docs/PROJECT_STATUS.md` on GitHub  

### 2.6 Templates (commit in DEV-002)

- `.github/PULL_REQUEST_TEMPLATE.md`  
- `.github/ISSUE_TEMPLATE/story.md`  
- `CODEOWNERS` for `packages/rules-engine/`, `.github/`  

---

## 3. Pull requests & review

### PR title format

```
[DEV-001] feat(platform): monorepo scaffold with Turborepo
```

### PR description checklist

```markdown
## Story
DEV-001 — Monorepo scaffold

## Acceptance criteria
- [x] pnpm-workspace + turbo
- [x] pnpm dev / pnpm build pass

## Screenshots / notes
...

## PROJECT_STATUS
- [ ] Updated if client-visible
```

### Who merges

| Target | Who | When |
|--------|-----|------|
| `staging` | Author after 1 approval + green CI | Every story |
| `main` | Tech lead / CTO | Weekly release or milestone |

---

## 4. CI pipeline (Story DEV-003)

File: `.github/workflows/ci.yml`

**Runs on:** every PR to `staging` or `main`, push to `staging`/`main`

| Job | Command |
|-----|---------|
| lint | `pnpm lint` |
| typecheck | `pnpm typecheck` |
| test | `pnpm test` |
| build | `pnpm build` |

**Services:** Postgres 16 + Redis 7 for integration tests (later stories).

**Required checks** must be enabled on branch protection before merging.

---

## 5. Deployment

### 5.1 Environments

| Env | Branch | URL (example) | Database |
|-----|--------|---------------|----------|
| Local | any | http://localhost:3000 | Docker Postgres |
| Staging | `staging` | https://staging.lanceflow.app | Neon staging |
| Production | `main` + tag | https://app.lanceflow.app | Neon production |

### 5.2 Staging (Story DEV-004)

**Option A — Vercel (recommended for Next.js)**

1. vercel.com → Import GitHub repo  
2. Production branch: `main`  
3. Create **Preview** for PRs; set **Staging** project linked to `staging` branch  
4. Environment variables (Vercel dashboard):  
   - `DATABASE_URL` (Neon staging)  
   - `NEXT_PUBLIC_APP_URL`  
5. GitHub Actions `deploy-staging.yml` optional if Vercel auto-deploys on push  

**Option B — GitHub Actions only**

- Build `apps/web` → deploy artifact to host (Railway, Fly.io, etc.)  
- Run `pnpm db:migrate` in deploy step  

### 5.3 Production (Story DEV-005)

1. GitHub **Environments** → `production`  
2. Required reviewers: CTO  
3. Deploy on tag `v0.1.0` or manual `workflow_dispatch`  
4. Steps: backup DB → migrate → deploy → smoke `GET /api/health`  

### 5.4 Secrets (never in git)

Store in GitHub → Settings → Environments:

| Secret | Staging | Production |
|--------|---------|------------|
| DATABASE_URL | ✓ | ✓ |
| REDIS_URL | ✓ | ✓ |
| AUTH_SECRET | ✓ | ✓ |
| SENTRY_DSN | optional | ✓ |

Local: copy `.env.example` → `.env`

---

## 6. Local development

### Prerequisites

- Node.js 20+  
- pnpm 9 (`corepack enable && corepack prepare pnpm@9.15.0 --activate`)  
- Docker Desktop (for Postgres/Redis, DEV-006)  

### Commands

```bash
cd d:\Projects\LanceFlow
pnpm install
pnpm dev          # starts apps/web
pnpm build        # production build all packages
pnpm lint
pnpm typecheck
```

### Database (after CORE-001)

```bash
docker compose up -d
pnpm db:migrate
```

---

## 7. Releases & client updates

### When a story finishes

1. Merge PR to `staging`  
2. Confirm staging URL works  
3. Edit `documents/docs/PROJECT_STATUS.md`:  
   - **Current work** → next story  
   - **Progress at a glance** if milestone advanced  
   - Check off **What is complete today** if applicable  
4. Update `documents/stories/<ID>.md` → Status: **Done**  
5. Add line to `CHANGELOG.md` (root, when created)  

### Milestone release to production

```bash
git checkout main
git merge staging
git tag v0.1.0
git push origin main --tags
```

GitHub → **Releases** → draft notes from CHANGELOG for clients.

---

## 8. Changing requirements mid-sprint

When you add, update, or remove requirements:

1. Tell the agent what changed (or edit story file).  
2. Agent updates:  
   - `documents/stories/<STORY-ID>.md` (acceptance criteria)  
   - `documents/docs/PROJECT_STATUS.md` (notes / risks)  
   - `documents/docs/MODULAR_ARCHITECTURE.md` or design docs if structural  
3. If scope grows: split a new story (`OPS-003b`) rather than bloating the PR.  

---

## 9. Story order (M0 sprint)

| # | Story | Delivers |
|---|-------|----------|
| 1 | **DEV-001** | Monorepo — *in progress* |
| 2 | DEV-002 | GitHub + branch protection |
| 3 | DEV-003 | CI |
| 4 | DEV-004 | Staging URL for client |
| 5 | DEV-006 | Docker local DB |
| 6 | DEV-007 | Sentry / health |
| 7 | DEV-008 | Status automation reminders |

Then **CORE-001** (database) → auth → RBAC …

---

## 10. Troubleshooting

| Problem | Fix |
|---------|-----|
| `pnpm` not found | `corepack enable && corepack prepare pnpm@9.15.0 --activate` |
| CI fails on Windows-only paths | Use forward slashes in imports; run CI on `ubuntu-latest` |
| Vercel build fails | Set root to `apps/web` or monorepo preset; set `pnpm install` at root |
| Migration failed on deploy | Roll back deploy; fix migration; never edit applied migrations |

---

*Update this guide when tooling choices change. Last aligned with DEV-001 — May 2026.*
