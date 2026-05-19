# LanceFlow — DevOps & GitHub Workflow

GitHub as the **single source of truth** for code, reviews, CI status, releases, and **client-visible project progress**.

**Related:** [PROJECT_STATUS.md](./PROJECT_STATUS.md) · [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)

---

## 1. Repository & branches

### 1.1 Branch model (GitHub Flow + staging)

| Branch | Purpose | Deploys to |
|--------|---------|------------|
| `main` | Production-ready; protected | Production (manual or tagged approve) |
| `staging` | Integration branch for QA | Staging environment |
| `feature/<STORY-ID>-<short-slug>` | One user story per branch | Preview (optional Vercel) |
| `hotfix/<issue>-<slug>` | Urgent production fix | main + backport staging |

**Rules:**

- Never commit directly to `main` or `staging`.
- One story = one PR (split large stories in planning, not mid-PR).
- Rebase or merge `staging` into feature branch before PR if story > 3 days old.

### 1.2 Branch protection (`main`)

- Require PR, 1+ approval (2 for `payments`, `auth`, `rules-engine`)
- Require status checks: `ci / lint`, `ci / typecheck`, `ci / test`, `ci / build`
- Require linear history OR squash merge (team choice: **squash** recommended)
- Dismiss stale reviews on new push
- Restrict force-push

### 1.3 Branch protection (`staging`)

- Require PR + CI green
- Auto-deploy on merge

---

## 2. Pull request workflow

```
feature/STORY-XXX ──PR──► staging ──PR (release)──► main
                              │                        │
                              ▼                        ▼
                         staging URL              production URL
```

### 2.1 PR checklist (template)

- [ ] Story ID in title: `[OPS-003] Project lifecycle`
- [ ] Acceptance criteria in description (copy from story file)
- [ ] Module boundary respected (no cross-module deep imports)
- [ ] Tests added/updated
- [ ] Migration included (if schema change)
- [ ] `PROJECT_STATUS.md` updated if story changes client-visible milestone
- [ ] Feature flag noted (if applicable)

### 2.2 Review roles

| Area | Reviewer |
|------|----------|
| Default | Any engineer |
| `rules-engine`, RBAC | Tech lead / CTO |
| CI/CD, infra | DevOps owner |
| AI prompts / hiring scores | CTO + ML owner |
| UI/UX Control Center | Product + 1 engineer |

### 2.3 Merge policy

- Squash merge to `staging` with message: `[OPS-003] feat(operations): project lifecycle states`
- Release PR `staging` → `main`: weekly or per milestone; tag `v0.3.0`

---

## 3. CI pipeline (GitHub Actions)

### 3.1 Workflow: `ci.yml` (on PR + push to staging/main)

```yaml
# Jobs (parallel where possible):
# 1. lint      — eslint, prettier check
# 2. typecheck — turbo typecheck all packages
# 3. test      — unit + integration (postgres + redis services)
# 4. build     — turbo build apps/web
# 5. rules-test — mandatory fast suite for @lanceflow/rules-engine
```

**Fail PR** if any required job fails.

### 3.2 Workflow: `deploy-staging.yml`

- Trigger: push to `staging`
- Steps: build → run migrations → deploy Vercel preview/staging → smoke test `/api/health`
- Post Slack/email on failure (optional)

### 3.3 Workflow: `deploy-production.yml`

- Trigger: push tag `v*` or manual workflow_dispatch from `main`
- Steps: build → migrations (with backup step) → deploy production → smoke test
- Require GitHub Environment **production** with required reviewers (CTO)

### 3.4 Workflow: `update-project-status.yml` (optional)

- On PR merge to `staging`: comment or bot opens reminder to update `PROJECT_STATUS.md`
- On release tag: auto-set “Last release” date in status doc (script)

---

## 4. Environments

| Env | URL pattern | Database | Purpose |
|-----|-------------|----------|---------|
| **Local** | localhost:3000 | Docker Postgres + Redis | Development |
| **Preview** | `*.vercel.app` | Neon branch per PR (optional) | Story QA |
| **Staging** | `staging.lanceflow.app` | Neon staging | Client demos, UAT |
| **Production** | `app.lanceflow.app` | Neon production | Live |

### 4.1 Secrets (GitHub Environments)

- `DATABASE_URL`, `REDIS_URL`, `AUTH_SECRET`, `LLM_API_KEY`, `S3_*`, `SENTRY_DSN`
- Staging vs Production scoped separately
- No secrets in `documents/` or source

### 4.2 Config

- `packages/core/config` validates env at boot with Zod
- `.env.example` committed; `.env` gitignored

---

## 5. Client-visible status (GitHub for stakeholders)

Clients and leadership see progress **without** reading code.

### 5.1 `PROJECT_STATUS.md` (in repo)

- Human-readable: current phase, completed stories, demo links, risks
- Updated on every release PR and when a milestone completes
- Linked from README and GitHub repo description

### 5.2 GitHub Project board

Create project **“LanceFlow Build”** with columns:

| Column | Meaning |
|--------|---------|
| Backlog | Planned stories |
| Ready | Refined, unblocked |
| In Progress | Branch open |
| In Review | PR open |
| QA / Staging | Merged to staging, UAT |
| Done | On `main` / released |

Each card = one story ID (`OPS-003`). Link PR in card.

### 5.3 Milestones (GitHub)

Align with epics:

- `M0 — Platform & DevOps`
- `M1 — Foundation`
- `M2 — Operations Core`
- `M3 — Automation`
- `M4 — Control Center`
- `M5 — Payments & Trust`
- `M6 — Hiring MVP`
- `M7 — AI Hiring`
- `M8 — Scale`

### 5.4 Releases & changelog

- GitHub Releases from tags: `v0.1.0-staging-m2` notes for client
- `CHANGELOG.md` — Keep a Changelog format; consumer-friendly bullets

### 5.5 Optional: public status page

- GitHub Pages from `documents/docs/PROJECT_STATUS.md` via static site, or
- Notion embed, or
- Simple `status.lanceflow.app` (read-only) — Story **DEV-008**

---

## 6. Local DevOps (Docker Compose)

`docker-compose.yml` at repo root:

- `postgres:16`
- `redis:7`
- Optional `minio` for S3-compatible local storage

Commands documented in root `README.md`:

```bash
pnpm install
docker compose up -d
pnpm db:migrate
pnpm dev
```

---

## 7. Quality gates

| Gate | When |
|------|------|
| Unit tests | Every PR |
| Integration tests | Every PR touching DB/jobs |
| E2E (Playwright) | Nightly on staging + before release |
| Migration dry-run | CI against ephemeral Postgres |
| Security | Dependabot + `pnpm audit` in CI |

---

## 8. Team conventions

| Item | Convention |
|------|------------|
| Commits | Conventional Commits: `feat(operations): ...` |
| Story branch | `feature/OPS-003-project-lifecycle` |
| Package names | `@lanceflow/<module>` |
| Issue labels | `epic/operations`, `type/feat`, `prio/p0` |

---

## 9. Definition of Done (engineering)

- [ ] Acceptance criteria met
- [ ] Tests pass in CI
- [ ] RBAC verified for new endpoints
- [ ] Audit log on mutations and rule decisions
- [ ] Docs/README updated if setup changes
- [ ] Staging deploy verified
- [ ] Story moved to Done on GitHub Project

---

*Maintained by engineering; client-facing summary in PROJECT_STATUS.md.*
