# -*- coding: utf-8 -*-
"""Generate story markdown files with development prompts."""
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent / "stories"
BASE.mkdir(parents=True, exist_ok=True)

CTO_INTENT = """## CTO intent (do not violate)
- LanceFlow is a **structured performance ecosystem**, not a chaotic freelance marketplace.
- Encode leadership judgment as **rules + scores**, not ad-hoc UI logic.
- Every automated decision: store inputs, formula version, allow audited override.
- CEO/Ops touch **exceptions only**; default paths are automated.
- RBAC strict; no cross-role data leaks.
- Prefer extending `packages/modules/*` over growing `apps/web` with business logic."""

TEMPLATE = """# {id}: {title}

| Field | Value |
|-------|-------|
| **Epic** | {epic} |
| **Milestone** | {milestone} |
| **Priority** | {priority} |
| **Estimate** | {estimate} |
| **Modules** | `{modules}` |
| **Depends on** | {depends} |
| **Branch** | `feature/{branch}` |
| **Status** | Backlog |

---

## User story

{user_story}

---

## Acceptance criteria

{acceptance}

---

## Technical notes

{technical}

---

## DevOps & delivery

{devops}

---

## Definition of Done

- [ ] Acceptance criteria met
- [ ] Unit/integration tests in CI
- [ ] RBAC verified on new routes
- [ ] Audit log for mutations / rule outcomes
- [ ] PR merged to `staging` with story ID in title
- [ ] `PROJECT_STATUS.md` updated if milestone-visible

---

{cto_intent}

---

## Development prompt (copy into Cursor / agent)

```
You are implementing LanceFlow story {id}: {title}.

### Context
- Monorepo: apps/web (Next.js BFF), packages/modules/*, packages/rules-engine, packages/core/*
- Read: documents/docs/MODULAR_ARCHITECTURE.md, documents/docs/PLANNING_SUMMARY_AND_GUIDE.md
- This story touches: {modules}

### User story
{user_story}

### Acceptance criteria
{acceptance}

### Technical requirements
{technical}

### DevOps
{devops}

### Constraints
{constraints}

### Before finishing
1. List files created/changed by package
2. Add/update tests (rules-engine = 100% for new formulas)
3. Confirm no business logic in route handlers beyond validation
4. Document env vars in .env.example if new
5. Output PR description with acceptance checklist

Implement only this story. Do not refactor unrelated modules. Ask if a dependency story is not merged yet.
```
"""

stories: list[dict] = []


def S(
    id,
    title,
    epic,
    milestone,
    priority,
    estimate,
    modules,
    depends,
    branch,
    user_story,
    acceptance,
    technical,
    devops,
    constraints=None,
):
    stories.append(
        dict(
            id=id,
            title=title,
            epic=epic,
            milestone=milestone,
            priority=priority,
            estimate=estimate,
            modules=modules,
            depends=depends or "None",
            branch=branch,
            user_story=user_story,
            acceptance=acceptance,
            technical=technical,
            devops=devops,
            constraints=constraints or "- Do not break module import boundaries.",
        )
    )


# --- E0 DEVOPS ---
S(
    "DEV-001",
    "Monorepo scaffold and Turborepo",
    "E0 Platform",
    "M0",
    "P0",
    "3d",
    "core/*, apps/web",
    "None",
    "DEV-001-monorepo",
    "As a developer, I want a pnpm + Turborepo monorepo so the team can work in isolated packages.",
    "- [ ] pnpm-workspace.yaml, turbo.json, apps/web, packages/core/database, packages/core/types\n- [ ] `pnpm dev` starts web\n- [ ] `pnpm build` succeeds\n- [ ] Matches MODULAR_ARCHITECTURE.md layout",
    "Use Next.js 15 App Router, TypeScript strict, ESLint + Prettier shared config.",
    "CI not required yet; local README with setup steps.",
)

S(
    "DEV-002",
    "GitHub repository and branch protection",
    "E0 Platform",
    "M0",
    "P0",
    "1d",
    "(repo meta)",
    "DEV-001",
    "DEV-002-github",
    "As CTO, I want protected main/staging branches so only reviewed code ships.",
    "- [ ] GitHub repo created, teams with write access\n- [ ] Branch protection on main and staging per DEVOPS doc\n- [ ] PR template + issue templates committed\n- [ ] CODEOWNERS for rules-engine and .github",
    "Follow documents/docs/DEVOPS_AND_GITHUB_WORKFLOW.md exactly.",
    "No deploy; configure branch rules and templates only.",
    "- Do not store secrets in repo.",
)

S(
    "DEV-003",
    "CI pipeline (lint, typecheck, test, build)",
    "E0 Platform",
    "M0",
    "P0",
    "2d",
    ".github/workflows",
    "DEV-001",
    "DEV-003-ci",
    "As a team, we want CI on every PR so broken code cannot merge.",
    "- [ ] ci.yml runs lint, typecheck, test, build\n- [ ] Required checks on main/staging\n- [ ] Postgres + Redis service containers for integration tests\n- [ ] Fails on lint or test failure",
    "GitHub Actions + turbo remote cache optional.",
    "Runs on pull_request and push to staging/main.",
    "- Keep workflow under 10 min; parallel jobs.",
)

S(
    "DEV-004",
    "Staging deployment pipeline",
    "E0 Platform",
    "M0",
    "P0",
    "2d",
    ".github/workflows, apps/web",
    "DEV-003",
    "DEV-004-deploy-staging",
    "As a client, I want a staging URL to see progress without production risk.",
    "- [ ] deploy-staging.yml on merge to staging\n- [ ] Neon staging DB + migrations step\n- [ ] Health check /api/health post-deploy\n- [ ] URL documented in PROJECT_STATUS.md",
    "Vercel or similar; DATABASE_URL via GitHub Environment staging.",
    "Auto-deploy staging; notify on failure.",
    "- Never use production secrets in staging workflow.",
)

S(
    "DEV-005",
    "Production deployment and approvals",
    "E0 Platform",
    "M0",
    "P1",
    "2d",
    ".github/workflows",
    "DEV-004",
    "DEV-005-deploy-prod",
    "As CTO, I want gated production deploys with reviewer approval.",
    "- [ ] deploy-production.yml on version tag or manual\n- [ ] GitHub Environment production with required reviewers\n- [ ] Smoke test after deploy\n- [ ] Rollback documented in runbook",
    "Tag format v0.x.y; CHANGELOG.md required on release PR.",
    "Manual workflow_dispatch allowed for hotfix.",
    "- Migrations must be backward-compatible or have rollback plan.",
)

S(
    "DEV-006",
    "Docker Compose local stack",
    "E0 Platform",
    "M0",
    "P1",
    "1d",
    "docker-compose.yml",
    "DEV-001",
    "DEV-006-docker",
    "As a developer, I want one command to run Postgres and Redis locally.",
    "- [ ] docker-compose.yml with postgres:16, redis:7\n- [ ] Documented in root README\n- [ ] Optional MinIO for file storage",
    "Volumes for data persistence; ports documented.",
    "Used by CI integration tests too if feasible.",
)

S(
    "DEV-007",
    "Observability baseline",
    "E0 Platform",
    "M0",
    "P2",
    "2d",
    "apps/web, packages/core/config",
    "DEV-004",
    "DEV-007-observability",
    "As Ops, I want errors and health visible in staging/production.",
    "- [ ] Sentry integrated\n- [ ] Structured JSON logs for API routes\n- [ ] /api/health returns DB + Redis status",
    "Do not log PII or secrets.",
    "SENTRY_DSN in GitHub secrets per environment.",
)

S(
    "DEV-008",
    "Client status automation",
    "E0 Platform",
    "M0",
    "P2",
    "1d",
    "documents/docs",
    "DEV-002",
    "DEV-008-status",
    "As a client, I want project status updated when we ship to staging.",
    "- [ ] PR template reminds to update PROJECT_STATUS.md\n- [ ] GitHub Project board template documented\n- [ ] Repo About links to PROJECT_STATUS.md",
    "Link PROJECT_STATUS in repo About section.",
    "Optional workflow comment on merge to staging.",
)

# --- E1 CORE ---
S(
    "CORE-001",
    "Database package and Prisma schema v0",
    "E1 Foundation",
    "M1",
    "P0",
    "3d",
    "packages/core/database",
    "DEV-001",
    "CORE-001-database",
    "As a platform, I need users and audit_logs persisted with migrations.",
    "- [ ] Prisma in packages/core/database\n- [ ] User model: id, email, role, status, displayName\n- [ ] AuditLog model\n- [ ] migrate dev + CI migration test",
    "Export Prisma client from package; apps import @lanceflow/database.",
    "Migration runs in deploy-staging workflow.",
)

S(
    "CORE-002",
    "Authentication and sessions",
    "E1 Foundation",
    "M1",
    "P0",
    "3d",
    "packages/core/auth, apps/web",
    "CORE-001",
    "CORE-002-auth",
    "As a user, I can sign in securely and maintain a session.",
    "- [ ] Auth provider integrated (Clerk/NextAuth)\n- [ ] Session in server components and API\n- [ ] Sign in/out flows\n- [ ] Protected routes redirect unauthenticated users",
    "Auth logic only in core/auth; web consumes helpers.",
    "AUTH secrets in env; document in .env.example.",
)

S(
    "CORE-003",
    "RBAC policies and middleware",
    "E1 Foundation",
    "M1",
    "P0",
    "3d",
    "packages/core/auth",
    "CORE-002",
    "CORE-003-rbac",
    "As CTO, I need role-based access for CEO, OpsManager, Caller, Bidder, Engineer.",
    "- [ ] Role enum and policy map\n- [ ] assertRole() / withAuth(handler, roles)\n- [ ] 403 on unauthorized API access\n- [ ] Tests for each role boundary",
    "Policies: CEO+Ops see control routes; Engineer cannot see hiring CEO queue.",
    "CI must include rbac unit tests.",
    "- Default deny; explicit allow per route.",
)

S(
    "CORE-004",
    "Design system and app shell",
    "E1 Foundation",
    "M1",
    "P0",
    "3d",
    "packages/core/ui, apps/web",
    "DEV-001",
    "CORE-004-ui",
    "As a user, I see a consistent LanceFlow UI with navigation by role.",
    "- [ ] Tailwind + shadcn in packages/core/ui\n- [ ] StatusBadge green/yellow/red\n- [ ] App shell: sidebar, header, role-aware nav",
    "Export components from @lanceflow/ui only.",
    "No deploy-specific changes.",
)

S(
    "CORE-005",
    "Marketing and brand pages",
    "E1 Foundation",
    "M1",
    "P1",
    "2d",
    "apps/web",
    "CORE-004",
    "CORE-005-brand",
    "As a visitor, I understand LanceFlow vision from the public site.",
    "- [ ] Landing page with Foundation narrative\n- [ ] Tagline: Where Strong Action Meets Seamless Flow",
    "Content from documents Foundation doc.",
    "Deploy to staging for client review.",
)

S(
    "CORE-006",
    "Audit log service",
    "E1 Foundation",
    "M1",
    "P0",
    "2d",
    "packages/audit",
    "CORE-001",
    "CORE-006-audit",
    "As CTO, every sensitive action is auditable.",
    "- [ ] audit.log({ actorId, action, entityType, entityId, payload })\n- [ ] Query API for CEO read-only paginated",
    "Immutable insert-only; no update/delete.",
    "Include in integration test harness.",
)

# --- E2 OPS (abbreviated in script - full set) ---
for spec in [
    (
        "OPS-001",
        "Client module CRUD",
        "E2 Operations",
        "M2",
        "P0",
        "3d",
        "packages/modules/operations",
        "CORE-003",
        "OPS-001-clients",
        "As Ops, I can create and manage client records.",
        "- [ ] Client CRUD API + UI\n- [ ] RBAC: Ops write; Bidder read",
        "Service in operations module; thin API routes.",
        "Ship behind feature flag if needed.",
    ),
    (
        "OPS-002",
        "Client risk score v0",
        "E2 Operations",
        "M2",
        "P0",
        "2d",
        "packages/modules/operations",
        "OPS-001",
        "OPS-002-client-risk",
        "As a Bidder, I see client risk score 0-100.",
        "- [ ] riskScore + manual override with audit",
        "Prepare for AUTO-006.",
        "None.",
    ),
    (
        "OPS-003",
        "Project lifecycle",
        "E2 Operations",
        "M2",
        "P0",
        "5d",
        "packages/modules/operations",
        "OPS-001",
        "OPS-003-projects",
        "As Ops, I manage projects through defined states.",
        "- [ ] States: draft, pending_approval, active, delivered, closed\n- [ ] scopeClarityPct, profitMarginPct",
        "Manual transitions only in this story.",
        "E2E test create flow.",
    ),
    (
        "OPS-004",
        "Worker skills and workload",
        "E2 Operations",
        "M2",
        "P0",
        "3d",
        "packages/modules/operations",
        "CORE-003",
        "OPS-004-workload",
        "As Ops, I see engineer skills and workload.",
        "- [ ] skillTags on engineer users\n- [ ] activeAssignmentCount",
        "Workload = active assignments count.",
        "None.",
    ),
    (
        "OPS-005",
        "Assignment algorithm v1",
        "E2 Operations",
        "M2",
        "P0",
        "3d",
        "packages/modules/operations, packages/rules-engine",
        "OPS-003,OPS-004",
        "OPS-005-assign",
        "As Ops, I assign the best engineer using ranked suggestions.",
        "- [ ] Ranking in rules-engine\n- [ ] Assignment record with skillScore snapshot",
        "Unit tests for ranking.",
        "None.",
    ),
    (
        "OPS-006",
        "Daily self-reporting",
        "E2 Operations",
        "M2",
        "P0",
        "3d",
        "packages/modules/operations",
        "OPS-003",
        "OPS-006-daily-reports",
        "As Engineer, I submit daily progress without being asked.",
        "- [ ] Form: hours, progressPct, issues\n- [ ] Missing report query for Ops",
        "One per user/project/day.",
        "None.",
    ),
    (
        "OPS-007",
        "SOP document store",
        "E2 Operations",
        "M2",
        "P2",
        "2d",
        "packages/modules/operations",
        "OPS-001",
        "OPS-007-sops",
        "As employee, I open SOPs for key processes.",
        "- [ ] SOP list by category with links",
        "Placeholder URLs OK.",
        "None.",
    ),
    (
        "OPS-008",
        "Ops Manager console shell",
        "E2 Operations",
        "M2",
        "P1",
        "3d",
        "apps/web",
        "OPS-001,OPS-003",
        "OPS-008-ops-console",
        "As Ops Manager, I have a workflow dashboard.",
        "- [ ] /ops route: projects, missing reports, assignments",
        "RBAC Ops + CEO.",
        "Staging demo for client.",
    ),
]:
    S(*spec)

# --- E3 AUTO ---
for spec in [
    (
        "AUTO-001",
        "Rules engine core",
        "E3 Automation",
        "M3",
        "P0",
        "4d",
        "packages/rules-engine",
        "CORE-006",
        "AUTO-001-rules-core",
        "As platform, I evaluate versioned rules with explainable outputs.",
        "- [ ] evaluateRule() with version and explanation\n- [ ] 100% unit test coverage",
        "Pure TypeScript; no DB.",
        "rules-test required in CI.",
    ),
    (
        "AUTO-002",
        "Project auto-approval",
        "E3 Automation",
        "M3",
        "P0",
        "3d",
        "packages/modules/automation, packages/rules-engine",
        "AUTO-001,OPS-003",
        "AUTO-002-auto-approve",
        "As CEO, projects auto-approve when thresholds met.",
        "- [ ] risk<60 AND margin>25% AND scope>80%\n- [ ] RuleDecision stored",
        "Thresholds in config.",
        "Boundary integration tests.",
    ),
    (
        "AUTO-003",
        "Auto task assignment on activate",
        "E3 Automation",
        "M3",
        "P0",
        "2d",
        "packages/modules/automation",
        "AUTO-001,OPS-005",
        "AUTO-003-auto-assign",
        "As Ops, project activation can auto-assign engineer.",
        "- [ ] Feature flag autoAssignEnabled\n- [ ] Override with audit",
        "Reuse OPS-005 ranking.",
        "None.",
    ),
    (
        "AUTO-004",
        "Payment schedule entity",
        "E3 Automation",
        "M3",
        "P0",
        "2d",
        "packages/modules/payments",
        "OPS-003",
        "AUTO-004-payments-entity",
        "As finance, I track payment due dates per project.",
        "- [ ] Payment model with escalationLevel",
        "payments module created.",
        "Migration in CI.",
    ),
    (
        "AUTO-005",
        "Payment reminder and escalation jobs",
        "E3 Automation",
        "M3",
        "P0",
        "3d",
        "packages/modules/payments, apps/worker",
        "AUTO-004",
        "AUTO-005-payment-jobs",
        "As CEO, payment follow-up is automated.",
        "- [ ] due reminder, day 3 escalate, day 7 risk flag",
        "BullMQ + Redis.",
        "Redis in staging.",
    ),
    (
        "AUTO-006",
        "Client risk pre-screen API",
        "E3 Automation",
        "M3",
        "P0",
        "2d",
        "packages/modules/automation",
        "OPS-002",
        "AUTO-006-risk-prescreen",
        "As Bidder, I run risk check before accepting bid.",
        "- [ ] POST risk-evaluate with audit",
        "Structure for LLM later.",
        "None.",
    ),
    (
        "AUTO-007",
        "Notification service",
        "E3 Automation",
        "M3",
        "P1",
        "3d",
        "packages/modules/automation",
        "DEV-004",
        "AUTO-007-notifications",
        "As user, I get email/in-app notifications.",
        "- [ ] Email adapter + in-app bell",
        "Resend/SendGrid.",
        "API keys in staging.",
    ),
    (
        "AUTO-008",
        "Exception queue for leadership",
        "E3 Automation",
        "M3",
        "P0",
        "3d",
        "packages/modules/automation, apps/web",
        "AUTO-002",
        "AUTO-008-exceptions",
        "As CEO, I review only exceptions.",
        "- [ ] Exception inbox with severity colors",
        "Red/yellow/green alignment.",
        "Client demo.",
    ),
]:
    S(*spec)

# --- E4 KPI ---
for spec in [
    (
        "KPI-001",
        "KPI calculators by role",
        "E4 Analytics",
        "M4",
        "P0",
        "4d",
        "packages/modules/analytics, packages/rules-engine",
        "OPS-006",
        "KPI-001-calculators",
        "As CTO, role KPIs use defined formulas.",
        "- [ ] Worker, Bidder, Caller formulas per planning doc",
        "100% formula tests.",
        "None.",
    ),
    (
        "KPI-002",
        "Nightly KPI rollup job",
        "E4 Analytics",
        "M4",
        "P0",
        "2d",
        "packages/modules/analytics, apps/worker",
        "KPI-001",
        "KPI-002-kpi-job",
        "As CEO, KPIs refresh nightly.",
        "- [ ] KPIRecord per user per period\n- [ ] Idempotent cron",
        "Week period default.",
        "Seed data on staging.",
    ),
    (
        "KPI-003",
        "Control Center summary API",
        "E4 Analytics",
        "M4",
        "P0",
        "3d",
        "packages/modules/analytics",
        "KPI-002,AUTO-008",
        "KPI-003-cc-api",
        "As CEO, one API returns all signals.",
        "- [ ] GET /control-center/summary\n- [ ] RBAC CEO+Ops",
        "Read-only aggregates.",
        "None.",
    ),
    (
        "KPI-004",
        "Control Center dashboard UI",
        "E4 Analytics",
        "M4",
        "P0",
        "4d",
        "apps/web, packages/core/ui",
        "KPI-003",
        "KPI-004-cc-ui",
        "As CEO, I monitor company in ~10 minutes.",
        "- [ ] /control-center with StatusBadge cards",
        "Desktop-first.",
        "M4 client demo.",
    ),
    (
        "KPI-005",
        "Signal threshold configuration",
        "E4 Analytics",
        "M4",
        "P1",
        "2d",
        "packages/modules/analytics",
        "KPI-003",
        "KPI-005-thresholds",
        "As CTO, I configure green/yellow/red thresholds.",
        "- [ ] Admin config with audit",
        "CEO-only write.",
        "None.",
    ),
    (
        "KPI-006",
        "Bonus and penalty suggestions",
        "E4 Analytics",
        "M4",
        "P2",
        "2d",
        "packages/modules/analytics",
        "KPI-001",
        "KPI-006-bonus",
        "As Ops, I approve system bonus/penalty suggestions.",
        "- [ ] Suggestions from KPI; Ops approve with audit",
        "Not payroll integration.",
        "None.",
    ),
]:
    S(*spec)

# --- E5 PAY ---
for spec in [
    (
        "PAY-001",
        "Project milestone model",
        "E5 Payments",
        "M5",
        "P0",
        "3d",
        "packages/modules/payments",
        "OPS-003",
        "PAY-001-milestones",
        "As Ops, I define payment milestones per project.",
        "- [ ] Milestones sum to 100%",
        "Validate in service.",
        "None.",
    ),
    (
        "PAY-002",
        "Escrow and work gating",
        "E5 Payments",
        "M5",
        "P0",
        "4d",
        "packages/modules/payments",
        "PAY-001",
        "PAY-002-escrow",
        "As CTO, work stops if milestone unpaid.",
        "- [ ] Block progress on overdue\n- [ ] Ops override audited",
        "Manual escrow flag OK.",
        "E2E block/unblock.",
    ),
    (
        "PAY-003",
        "Milestone-linked payment reminders",
        "E5 Payments",
        "M5",
        "P1",
        "2d",
        "packages/modules/payments",
        "PAY-001,AUTO-005",
        "PAY-003-milestone-remind",
        "As finance, reminders use milestone due dates.",
        "- [ ] Jobs tied to milestones",
        "Extend AUTO-005.",
        "None.",
    ),
    (
        "PAY-004",
        "Fraud triggers v1",
        "E5 Payments",
        "M5",
        "P1",
        "3d",
        "packages/modules/automation",
        "KPI-002,OPS-006",
        "PAY-004-fraud",
        "As CEO, fraud signals surface automatically.",
        "- [ ] Rules create exceptions; CEO sees severe only",
        "Rule-based v1.",
        "None.",
    ),
    (
        "PAY-005",
        "Dispute workflow",
        "E5 Payments",
        "M5",
        "P2",
        "3d",
        "packages/modules/operations",
        "OPS-007",
        "PAY-005-disputes",
        "As Ops, I handle disputes via SOP workflow.",
        "- [ ] Dispute states with CEO escalation on high value",
        "Link SOP.",
        "None.",
    ),
]:
    S(*spec)

# --- E6 HIRE ---
for spec in [
    (
        "HIRE-001",
        "Candidate application portal",
        "E6 Hiring",
        "M6",
        "P0",
        "4d",
        "packages/modules/hiring",
        "CORE-003",
        "HIRE-001-portal",
        "As candidate, I apply with resume and role.",
        "- [ ] Upload to object storage\n- [ ] Consent checkbox",
        "Max file size enforced.",
        "S3 secrets staging.",
    ),
    (
        "HIRE-002",
        "Resume parser integration",
        "E6 Hiring",
        "M6",
        "P0",
        "4d",
        "packages/modules/ai-hiring",
        "HIRE-001",
        "HIRE-002-resume",
        "As HR, resume is structured automatically.",
        "- [ ] Extract years, stack, seniority, job hop index",
        "Zod validate LLM output.",
        "Fixture in CI.",
    ),
    (
        "HIRE-003",
        "Technical assessment hook",
        "E6 Hiring",
        "M6",
        "P1",
        "3d",
        "packages/modules/hiring",
        "HIRE-001",
        "HIRE-003-assessment",
        "As recruiter, I attach coding test scores.",
        "- [ ] technicalScore 0-100 on candidate",
        "Webhook placeholder OK.",
        "None.",
    ),
    (
        "HIRE-004",
        "THS and RS calculators v1",
        "E6 Hiring",
        "M6",
        "P0",
        "3d",
        "packages/rules-engine, packages/modules/hiring",
        "HIRE-002,AUTO-001",
        "HIRE-004-scores",
        "As CTO, THS and RS match Hiring template.",
        "- [ ] THS and RS formulas\n- [ ] Auto-reject RS>70",
        "Golden tests.",
        "CTO review PR.",
    ),
    (
        "HIRE-005",
        "Hiring pipeline dashboard",
        "E6 Hiring",
        "M6",
        "P0",
        "3d",
        "apps/web, packages/modules/hiring",
        "HIRE-004",
        "HIRE-005-pipeline",
        "As HR, I see pipeline and score distribution.",
        "- [ ] Stages + filters + time-to-hire",
        "RBAC HR/Ops/CEO.",
        "None.",
    ),
    (
        "HIRE-006",
        "Hiring decision engine output",
        "E6 Hiring",
        "M6",
        "P0",
        "2d",
        "packages/modules/hiring",
        "HIRE-004",
        "HIRE-006-decision",
        "As HR, I see Reject/Hold/Hire/Fast Track.",
        "- [ ] Decision enum + override audit",
        "RP stub OK.",
        "None.",
    ),
    (
        "HIRE-007",
        "CEO filtered hiring queue",
        "E6 Hiring",
        "M6",
        "P0",
        "2d",
        "apps/web",
        "HIRE-006",
        "HIRE-007-ceo-queue",
        "As CEO, I see only top candidates and high risk.",
        "- [ ] CEO-only queue endpoint",
        "80-90% review reduction goal.",
        "Client demo.",
    ),
    (
        "HIRE-008",
        "Candidate email notifications",
        "E6 Hiring",
        "M6",
        "P2",
        "2d",
        "packages/modules/hiring, packages/modules/automation",
        "HIRE-006,AUTO-007",
        "HIRE-008-candidate-email",
        "As candidate, I receive decision emails.",
        "- [ ] reject/hold/hire templates",
        "Use AUTO-007.",
        "None.",
    ),
]:
    S(*spec)

# --- E7 AI ---
for spec in [
    (
        "AI-001",
        "English and communication analyzer",
        "E7 AI Hiring",
        "M7",
        "P1",
        "3d",
        "packages/modules/ai-hiring",
        "HIRE-002",
        "AI-001-communication",
        "As HR, written communication is scored.",
        "- [ ] grammar, clarity, persuasion scores",
        "LLM rubric.",
        "Cost cap per candidate.",
    ),
    (
        "AI-002",
        "EI scenario simulator",
        "E7 AI Hiring",
        "M7",
        "P1",
        "4d",
        "packages/modules/ai-hiring",
        "HIRE-001",
        "AI-002-ei-sim",
        "As HR, candidates complete EI scenarios.",
        "- [ ] 3 scenarios minimum with scores",
        "Async LLM job.",
        "CTO reviews rubric.",
    ),
    (
        "AI-003",
        "Interview STT pipeline",
        "E7 AI Hiring",
        "M7",
        "P1",
        "4d",
        "packages/modules/ai-hiring",
        "HIRE-001",
        "AI-003-stt",
        "As HR, interviews are transcribed.",
        "- [ ] Whisper/Deepgram + consent flag",
        "Object storage for media.",
        "90 day retention default.",
    ),
    (
        "AI-004",
        "Interview transcript analyzer",
        "E7 AI Hiring",
        "M7",
        "P1",
        "4d",
        "packages/modules/ai-hiring",
        "AI-003",
        "AI-004-transcript",
        "As HR, transcripts yield professionalism and stress scores.",
        "- [ ] filler, tone, technical depth metrics",
        "Golden fixtures.",
        "None.",
    ),
    (
        "AI-005",
        "Role-specific hiring weight profiles",
        "E7 AI Hiring",
        "M7",
        "P0",
        "2d",
        "packages/rules-engine",
        "HIRE-004",
        "AI-005-role-weights",
        "As CTO, Caller/Bidder/Engineer use different THS weights.",
        "- [ ] Profiles per Hiring template",
        "CTO must review PR.",
        "None.",
    ),
    (
        "AI-006",
        "Revenue Potential index",
        "E7 AI Hiring",
        "M7",
        "P1",
        "3d",
        "packages/rules-engine, packages/modules/hiring",
        "HIRE-004",
        "AI-006-rp",
        "As CEO, I prioritize by RP band.",
        "- [ ] Low/Medium/High bands on card",
        "Formula from planning doc.",
        "None.",
    ),
    (
        "AI-007",
        "Continuous learning weight proposal",
        "E7 AI Hiring",
        "M7",
        "P2",
        "4d",
        "packages/modules/ai-hiring",
        "KPI-002,HIRE-004",
        "AI-007-learning",
        "As CTO, system proposes formula adjustments after 6 months.",
        "- [ ] Proposal only; CEO approves new version",
        "Monthly job.",
        "Never auto-apply weights.",
    ),
    (
        "AI-008",
        "Hiring audit safeguards",
        "E7 AI Hiring",
        "M7",
        "P1",
        "2d",
        "packages/audit, packages/modules/hiring",
        "HIRE-006",
        "AI-008-safeguards",
        "As CTO, 10% random audits and explainable scores.",
        "- [ ] Score breakdown UI + formula version",
        "Per Hiring template section 13.",
        "None.",
    ),
]:
    S(*spec)

# --- E8 SCALE ---
for spec in [
    (
        "SCALE-001",
        "Advanced fraud detection",
        "E8 Scale",
        "M8",
        "P2",
        "5d",
        "packages/modules/automation",
        "PAY-004",
        "SCALE-001-fraud-adv",
        "As CTO, fraud detection scales with team.",
        "- [ ] Configurable rules + Ops workspace",
        "Legal review for comms patterns.",
        "None.",
    ),
    (
        "SCALE-002",
        "Internal audit role workspace",
        "E8 Scale",
        "M8",
        "P2",
        "4d",
        "apps/web",
        "CORE-003",
        "SCALE-002-audit-role",
        "As auditor, I have read-only decision views.",
        "- [ ] Audit role RBAC read-only",
        "No mutations.",
        "None.",
    ),
    (
        "SCALE-003",
        "Hiring ROI calculator",
        "E8 Scale",
        "M8",
        "P2",
        "3d",
        "packages/modules/analytics",
        "HIRE-007,KPI-002",
        "SCALE-003-hiring-roi",
        "As CEO, I see cost per hire vs realized RP.",
        "- [ ] Dashboard widget with clear labels",
        "Needs production data.",
        "None.",
    ),
    (
        "SCALE-004",
        "Promotion fast-track flags",
        "E8 Scale",
        "M8",
        "P2",
        "2d",
        "packages/modules/analytics",
        "KPI-002",
        "SCALE-004-promotion",
        "As HR, high KPI employees flagged for promotion.",
        "- [ ] Review list for Ops/CEO",
        "Suggestions only.",
        "None.",
    ),
    (
        "SCALE-005",
        "Caller to Bidder qualification workflow",
        "E8 Scale",
        "M8",
        "P2",
        "3d",
        "packages/modules/operations",
        "KPI-001",
        "SCALE-005-cross-role",
        "As Caller, I apply for Bidder when metrics qualify.",
        "- [ ] Eligibility rules + approval workflow",
        "From planning cross-role section.",
        "None.",
    ),
]:
    S(*spec)

for s in stories:
    content = TEMPLATE.format(
        id=s["id"],
        title=s["title"],
        epic=s["epic"],
        milestone=s["milestone"],
        priority=s["priority"],
        estimate=s["estimate"],
        modules=s["modules"],
        depends=s["depends"],
        branch=s["branch"],
        user_story=s["user_story"],
        acceptance=s["acceptance"],
        technical=s["technical"],
        devops=s["devops"],
        cto_intent=CTO_INTENT,
        constraints=s["constraints"],
    )
    (BASE / f"{s['id']}.md").write_text(content, encoding="utf-8")

index_lines = [
    "# Story index",
    "",
    "Each story includes a **Development prompt** section for Cursor/agents.",
    "",
    "Workflow: [DEVOPS_AND_GITHUB_WORKFLOW.md](../docs/DEVOPS_AND_GITHUB_WORKFLOW.md)",
    "",
    "| ID | Title | Epic | Milestone | Depends |",
    "|----|-------|------|-----------|---------|",
]
for s in stories:
    index_lines.append(
        f"| [{s['id']}](./{s['id']}.md) | {s['title']} | {s['epic']} | {s['milestone']} | {s['depends']} |"
    )
(BASE / "README.md").write_text("\n".join(index_lines) + "\n", encoding="utf-8")
print(f"Generated {len(stories)} story files in {BASE}")
