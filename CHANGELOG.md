# Changelog

All notable changes to the LanceFlow application are documented here.

## [Unreleased]

### Added

- **PAY-002** ? Escrow and work gating: block progress transitions and daily reports when escrow is held or payments are overdue; Ops override with audit (`escrow_held`, `escrow_override_*` on projects)
- **PAY-001** ? Project payment milestones (`project_milestones`, sum to 100%); `GET/PUT /api/projects/[id]/milestones`; project detail UI

### Database

Staging migrate deploy adds:

- `project_milestones`
- `escrow_held`, `escrow_override_reason`, `escrow_override_by`, `escrow_override_at` on `ops_projects`

## [0.6.0] ฮ?ร?รถ 2026-05-25

M4 Analytics on production: role KPIs, Control Center, configurable thresholds, and Ops-approved bonus/penalty suggestions.

### Added

- **KPI-006** ฮ?ร?รถ Bonus/penalty suggestions from weekly KPI (`compensation_suggestions`); Ops approve/reject with audit; auto-generated after KPI rollup
- **KPI-005** ฮ?ร?รถ CEO-configurable green/yellow/red signal thresholds (`kpi_signal_thresholds`); audited updates; Control Center cards use live bands
- **KPI-004** ฮ?ร?รถ Control Center dashboard cards at `/control` (StatusBadge KPIs + `/control-center` alias)
- **KPI-003** ฮ?ร?รถ `GET /api/control-center/summary` (exceptions, weekly KPI by role, ops aggregates); CEO/Ops RBAC
- **KPI-002** ฮ?ร?รถ Nightly KPI rollup (`kpi_records`, idempotent ISO-week upsert, BullMQ + `POST /api/jobs/kpi-rollup`)
- **KPI-001** ฮ?ร?รถ Role KPI calculators (Worker, Bidder, Caller) in `@lanceflow/analytics` + rules-engine

### Changed

- **Analytics** ฮ?ร?รถ `@lanceflow/analytics/client` export for client-safe threshold helpers (fixes Next.js bundle boundary)

### Database

Production migrate deploy adds:

- `kpi_records`
- `kpi_signal_thresholds`
- `compensation_suggestions`

### Production env (M4 jobs)

| Variable | Purpose |
|----------|---------|
| `KPI_ROLLUP_JOBS_ENABLED` | Enable KPI rollup + compensation suggestion generation in worker |
| `KPI_ROLLUP_CRON` | Cron pattern (default `0 3 * * *`) |

## [0.5.0] ฮ?ร?รถ 2026-05-25

M3 Automation on production: rules engine, auto-approve/assign, payments, notifications, and leadership exception inbox.

### Added

- **AUTO-008** ฮ?ร?รถ Leadership exception inbox at `/control`
- **AUTO-007** ฮ?ร?รถ In-app notification bell + Resend/noop email adapter; ops alerts on payment escalation
- **AUTO-006** ฮ?ร?รถ Client risk pre-screen API for Bidders (`POST /api/clients/[id]/risk-prescreen`, RuleDecision + audit)
- **AUTO-005** ฮ?ร?รถ Daily payment escalation job (due reminder, day-3 escalate, day-7 risk); BullMQ worker + manual `/api/jobs/payment-escalations`
- **AUTO-004** ฮ?ร?รถ `PaymentSchedule` entity per project (due date, amount, `escalationLevel`); CRUD APIs and project UI
- **AUTO-003** ฮ?ร?รถ Auto-assign top-ranked engineer on activate when `AUTO_ASSIGN_ENABLED`; audited override via `/api/projects/[id]/assign-override`
- **AUTO-002** ฮ?ร?รถ Project auto-approval when risk under 60, margin over 25%, scope over 80%; `RuleDecision` persisted; `/api/projects/[id]/auto-approve`
- **AUTO-001** ฮ?ร?รถ `evaluateRule()` with formula version and explanation; rule registry for assignment rank v1

### Database

Staging migrate deploy adds:

- `rule_decisions`
- `payment_schedules`
- `notifications`
- `leadership_exceptions`

## [0.4.1] ฮ?ร?รถ 2026-05-23

M2 Operations completion on production: daily reports, SOP library, and Ops console.

### Added

- **OPS-008** ฮ?ร?รถ Ops Manager console at `/ops` (workflow projects, missing reports, active assignments)
- **OPS-007** ฮ?ร?รถ SOP library by category at `/sops` (placeholder doc links)
- **OPS-006** ฮ?ร?รถ Daily self-reports (`/daily-reports`), missing-report queue (`/daily-reports/missing`)
- **DEV-008** ฮ?ร?รถ GitHub Project #4 board sync from `board-sync.json` and PR workflows

### Database

Production migrate deploy adds:

- `ops_daily_reports`

## [0.4.0] ฮ?ร?รถ 2026-05-22

M2 Operations core on production: projects, workload, assignment ranking, and app UX polish.

### Added

- **UX** ฮ?ร?รถ Sonner toasts (success/error/confirm), light/dark theme toggle in navbar and landing, `revalidatePath` after mutations so lists refresh
- **OPS-005** ฮ?ร?รถ `@lanceflow/rules-engine` assignment rank v1; assign engineers on project detail with `skillScore` snapshot
- **OPS-004** ฮ?ร?รถ Engineer `skill_tags`, `ops_assignments`, team workload UI (`/workers`)
- **OPS-003** ฮ?ร?รถ Project lifecycle (`draft` ฮ?รฅร? `closed`), `/projects` UI, transition API

### Database

Production migrate deploy adds:

- `ops_projects`
- `users.skill_tags`, `ops_assignments`
- `ops_assignments.formula_version`

## [0.3.0] ฮ?ร?รถ 2026-05-21

M1 Foundation + Ops clients and client risk v0.